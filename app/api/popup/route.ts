import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

const DEFAULTS = {
  enabled: true,
  headline: "İlk Siparişinde %10 İndirim",
  description: "Specialty kahve dünyasına adım at. İlk siparişinde bu kodu kullan, taze kavrum kapına gelsin.",
  discount_code: "HOSGELDIN10",
  discount_amount: "%10",
  button_text: "Kuponu Al",
  delay_seconds: 4,
}

export async function GET() {
  try {
    const { data, error } = await sb().from("popup_settings").select("*").eq("id", 1).single()
    // If table doesn't exist yet, fall back to defaults so popup still works
    if (error || !data) return NextResponse.json(DEFAULTS)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(DEFAULTS)
  }
}
