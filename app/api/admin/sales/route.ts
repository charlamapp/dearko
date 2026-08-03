import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isAdminRequest } from "@/lib/admin-auth"

const MARGIN = 0.42 // %42 brüt kar marjı varsayılan

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const ago90d = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  const { data: orders, error } = await sb()
    .from("orders")
    .select("total, created_at, status, items")
    .in("status", ["paid", "preparing", "shipped", "delivered"])
    .gte("created_at", ago90d)
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const now = new Date()
  const todayStart    = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart.getTime() - 86400000)
  const weekStart     = new Date(todayStart.getTime() - 7 * 86400000)
  const monthStart    = new Date(now.getFullYear(), now.getMonth(), 1)

  let todayRev = 0, todayOrders = 0
  let ystdRev  = 0, ystdOrders  = 0
  let weekRev  = 0, weekOrders  = 0
  let monthRev = 0, monthOrders = 0

  // 14-day daily buckets
  const dailyMap: Record<string, { revenue: number; orders: number }> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date(todayStart.getTime() - i * 86400000)
    dailyMap[d.toISOString().split("T")[0]] = { revenue: 0, orders: 0 }
  }

  // Product revenue map for top products
  const productMap: Record<string, { name: string; revenue: number; qty: number }> = {}

  for (const order of orders ?? []) {
    const d    = new Date(order.created_at)
    const total = (order.total ?? 0) / 100 // kuruş → TL

    if (d >= todayStart)                           { todayRev += total; todayOrders++ }
    if (d >= yesterdayStart && d < todayStart)     { ystdRev  += total; ystdOrders++  }
    if (d >= weekStart)                            { weekRev  += total; weekOrders++  }
    if (d >= monthStart)                           { monthRev += total; monthOrders++ }

    const key = d.toISOString().split("T")[0]
    if (dailyMap[key]) { dailyMap[key].revenue += total; dailyMap[key].orders++ }

    // Top products
    for (const item of (order.items ?? [])) {
      if (!item.name) continue
      if (!productMap[item.name]) productMap[item.name] = { name: item.name, revenue: 0, qty: 0 }
      productMap[item.name].revenue += (item.price ?? 0) / 100 * (item.qty ?? 1)
      productMap[item.name].qty += item.qty ?? 1
    }
  }

  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  return NextResponse.json({
    today:     { revenue: Math.round(todayRev), orders: todayOrders, grossProfit: Math.round(todayRev * MARGIN) },
    yesterday: { revenue: Math.round(ystdRev),  orders: ystdOrders  },
    week:      { revenue: Math.round(weekRev),  orders: weekOrders,  grossProfit: Math.round(weekRev  * MARGIN) },
    month:     { revenue: Math.round(monthRev), orders: monthOrders, grossProfit: Math.round(monthRev * MARGIN) },
    daily:     Object.entries(dailyMap).map(([date, d]) => ({ date, ...d })),
    topProducts,
    margin:    MARGIN,
  })
}
