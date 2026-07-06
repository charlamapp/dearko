import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function localFallback() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require("fs").readFileSync(
      require("path").join(process.cwd(), "data", "content.json"), "utf-8"
    )
    return JSON.parse(raw)
  } catch { return null }
}

export async function GET() {
  const { data, error } = await sb()
    .from("site_content")
    .select("id, data")

  if (error || !data?.length) {
    const fallback = localFallback()
    if (fallback) return NextResponse.json(fallback, {
      headers: { "Cache-Control": "no-store" }
    })
    return NextResponse.json({}, { headers: { "Cache-Control": "no-store" } })
  }

  const content: Record<string, unknown> = {}
  for (const row of data) content[row.id] = row.data

  return NextResponse.json(content, {
    headers: { "Cache-Control": "no-store" }
  })
}

export async function PATCH(req: Request) {
  const { section, data } = await req.json()

  const { error } = await sb()
    .from("site_content")
    .upsert({ id: section, data, updated_at: new Date().toISOString() })

  if (error) {
    console.error("Content save error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
