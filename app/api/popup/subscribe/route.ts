import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest) {
  try {
    const { email, discount_code } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geçersiz e-posta" }, { status: 400 })
    }
    const { error } = await sb().from("subscribers").upsert({ email, discount_code, source: "popup" }, { onConflict: "email", ignoreDuplicates: true })
    if (error) return NextResponse.json({ ok: false })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
