import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export async function GET() {
  const { data } = await sb().from("popup_settings").select("*").eq("id", 1).single()
  return NextResponse.json(data ?? { enabled: false })
}
