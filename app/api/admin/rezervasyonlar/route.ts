import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function checkAuth(req: Request) {
  return req.headers.get("x-admin-pw") === "dearko2024"
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const supabase = adminClient()
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, status, admin_notes } = await req.json()
  const supabase = adminClient()
  const updates: Record<string, string> = {}
  if (status !== undefined) updates.status = status
  if (admin_notes !== undefined) updates.admin_notes = admin_notes
  const { error } = await supabase.from("reservations").update(updates).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
