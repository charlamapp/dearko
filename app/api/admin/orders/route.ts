import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isAdminRequest } from "@/lib/admin-auth"

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const supabase = adminClient()
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // orders.user_id auth.users'a bağlı (profiles'a FK yok) → PostgREST embed
  // çalışmıyor; profilleri ayrıca çekip birleştiriyoruz.
  const userIds = [...new Set((orders ?? []).map((o) => o.user_id).filter(Boolean))]
  let profileMap: Record<string, { full_name: string | null; email: string | null; phone: string | null }> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone")
      .in("id", userIds)
    profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, { full_name: p.full_name, email: p.email, phone: p.phone }]))
  }

  return NextResponse.json((orders ?? []).map((o) => ({ ...o, profiles: profileMap[o.user_id] ?? null })))
}

export async function PATCH(req: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, status, tracking_number } = await req.json()
  const supabase = adminClient()
  const updates: Record<string, string> = {}
  if (status !== undefined) updates.status = status
  if (tracking_number !== undefined) updates.tracking_number = tracking_number
  const { error } = await supabase.from("orders").update(updates).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
