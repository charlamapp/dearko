import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-pw") !== "dearko2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sb = supabase()
  const now = Date.now()
  const ago30d = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString()
  const ago5m  = new Date(now - 5 * 60 * 1000).toISOString()
  const ago24h = new Date(now - 24 * 60 * 60 * 1000).toISOString()

  const [totalRes, activeRes, viewsRes, recentRes, hourlyRes] = await Promise.all([
    sb.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", ago30d),
    sb.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", ago5m),
    sb.from("page_views")
      .select("country, country_name, lat, lng")
      .gte("created_at", ago30d)
      .not("country", "is", null)
      .not("lat", "is", null),
    sb.from("page_views")
      .select("country, country_name, city, page, created_at")
      .order("created_at", { ascending: false })
      .limit(30),
    sb.from("page_views")
      .select("created_at")
      .gte("created_at", ago24h)
      .order("created_at", { ascending: true }),
  ])

  // Group by country
  type CountryEntry = { count: number; name: string; lat: number; lng: number }
  const countryMap: Record<string, CountryEntry> = {}
  for (const row of viewsRes.data ?? []) {
    if (!row.country) continue
    if (!countryMap[row.country]) {
      countryMap[row.country] = { count: 0, name: row.country_name ?? row.country, lat: Number(row.lat), lng: Number(row.lng) }
    }
    countryMap[row.country].count++
  }

  // Hourly buckets for the last 24h (24 buckets)
  const buckets: number[] = Array(24).fill(0)
  for (const row of hourlyRes.data ?? []) {
    const h = new Date(row.created_at).getHours()
    buckets[h]++
  }

  return NextResponse.json({
    total30d: totalRes.count ?? 0,
    activeNow: activeRes.count ?? 0,
    countries: Object.entries(countryMap)
      .map(([code, d]) => ({ code, ...d }))
      .sort((a, b) => b.count - a.count),
    recent: recentRes.data ?? [],
    hourly: buckets,
  })
}
