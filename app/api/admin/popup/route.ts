import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isAdminRequest } from "@/lib/admin-auth"

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const [settingsRes, subsRes] = await Promise.all([
    sb().from("popup_settings").select("*").eq("id", 1).single(),
    sb().from("subscribers").select("*").order("created_at", { ascending: false }),
  ])
  return NextResponse.json({ settings: settingsRes.data, subscribers: subsRes.data ?? [] })
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const { error } = await sb().from("popup_settings").update(body).eq("id", 1)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
