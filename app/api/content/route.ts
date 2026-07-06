import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const { data, error } = await sb()
    .from("site_content")
    .select("id, data")

  if (error || !data?.length) {
    // Fallback: dosyadan oku (local geliştirme)
    try {
      const { readFileSync } = await import("fs")
      const { join } = await import("path")
      const raw = readFileSync(join(process.cwd(), "data", "content.json"), "utf-8")
      return NextResponse.json(JSON.parse(raw))
    } catch {
      return NextResponse.json({})
    }
  }

  const content: Record<string, unknown> = {}
  for (const row of data) {
    content[row.id] = row.data
  }
  return NextResponse.json(content)
}

export async function PATCH(req: Request) {
  const { section, data } = await req.json()

  const { error } = await sb()
    .from("site_content")
    .upsert({ id: section, data, updated_at: new Date().toISOString() })

  if (error) {
    console.error("Content save error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
