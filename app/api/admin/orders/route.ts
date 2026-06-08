import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function checkAuth(req: Request) {
  const pw = req.headers.get("x-admin-pw")
  return pw === "dearko2024"
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const supabase = adminClient()
  const { data, error } = await supabase
    .from("orders")
    .select("*, profiles(full_name, email, phone)")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, status, tracking_number } = await req.json()
  const supabase = adminClient()
  const updates: Record<string, string> = {}
  if (status !== undefined) updates.status = status
  if (tracking_number !== undefined) updates.tracking_number = tracking_number
  const { error } = await supabase.from("orders").update(updates).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
