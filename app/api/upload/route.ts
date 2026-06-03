import { NextResponse } from "next/server"
import { writeFileSync, mkdirSync } from "fs"
import { join, extname } from "path"

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get("file") as File | null

  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 })

  const ext  = extname(file.name) || ".jpg"
  const name = `${Date.now()}${ext}`
  const dir  = join(process.cwd(), "public", "uploads")

  mkdirSync(dir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  writeFileSync(join(dir, name), buffer)

  return NextResponse.json({ url: `/uploads/${name}` })
}
