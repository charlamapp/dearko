import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest) {
  try {
    const { email, discount_code, source } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geçersiz e-posta" }, { status: 400 })
    }
    const src = source === "footer" ? "footer" : "popup"
    const { error } = await sb().from("subscribers").upsert({ email, discount_code, source: src }, { onConflict: "email", ignoreDuplicates: true })
    // Hata durumunda 200 dönmek istemciye sahte başarı gösterir ve e-postayı
    // sessizce kaybeder — bu yüzden gerçek hata kodu döndürülür.
    if (error) {
      console.error("subscribe error:", error.message)
      return NextResponse.json({ error: "Kayıt yapılamadı" }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("subscribe error:", e)
    return NextResponse.json({ error: "Kayıt yapılamadı" }, { status: 500 })
  }
}
