import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ISO → Turkish country names
const COUNTRY_NAMES: Record<string, string> = {
  TR: "Türkiye", US: "ABD", DE: "Almanya", GB: "Birleşik Krallık",
  FR: "Fransa", NL: "Hollanda", BE: "Belçika", AT: "Avusturya", CH: "İsviçre",
  IT: "İtalya", ES: "İspanya", SE: "İsveç", NO: "Norveç", DK: "Danimarka",
  FI: "Finlandiya", PL: "Polonya", CZ: "Çekya", RU: "Rusya",
  AE: "BAE", SA: "Suudi Arabistan", KW: "Kuveyt", QA: "Katar",
  BH: "Bahreyn", OM: "Umman", JO: "Ürdün", LB: "Lübnan",
  EG: "Mısır", MA: "Fas", TN: "Tunus", DZ: "Cezayir", LY: "Libya",
  AU: "Avustralya", NZ: "Yeni Zelanda", JP: "Japonya", CN: "Çin",
  KR: "Güney Kore", SG: "Singapur", MY: "Malezya", TH: "Tayland",
  IN: "Hindistan", PK: "Pakistan", BD: "Bangladeş", ID: "Endonezya",
  CA: "Kanada", MX: "Meksika", BR: "Brezilya", AR: "Arjantin",
  CL: "Şili", CO: "Kolombiya", PE: "Peru", VE: "Venezuela",
  ZA: "Güney Afrika", NG: "Nijerya", KE: "Kenya", ET: "Etiyopya",
  GR: "Yunanistan", PT: "Portekiz", RO: "Romanya", BG: "Bulgaristan",
  HU: "Macaristan", HR: "Hırvatistan", RS: "Sırbistan",
  UA: "Ukrayna", AZ: "Azerbaycan", GE: "Gürcistan", AM: "Ermenistan",
  KZ: "Kazakistan", UZ: "Özbekistan", IL: "İsrail", IQ: "Irak",
  IR: "İran", SY: "Suriye", CY: "Kıbrıs",
}

export async function POST(req: NextRequest) {
  try {
    const country = req.headers.get("x-vercel-ip-country") ?? ""
    if (!country) return NextResponse.json({ ok: false }) // local dev — skip

    const rawCity = req.headers.get("x-vercel-ip-city") ?? ""
    const city = decodeURIComponent(rawCity)
    const lat = parseFloat(req.headers.get("x-vercel-ip-latitude") ?? "") || null
    const lng = parseFloat(req.headers.get("x-vercel-ip-longitude") ?? "") || null

    const body = await req.json().catch(() => ({}))
    const page = (body.page as string) || "/"

    await supabase().from("page_views").insert({
      country,
      country_name: COUNTRY_NAMES[country] ?? country,
      city,
      lat,
      lng,
      page,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
