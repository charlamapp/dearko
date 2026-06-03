import { NextResponse } from "next/server"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const FILE = join(process.cwd(), "data", "content.json")

function read() {
  return JSON.parse(readFileSync(FILE, "utf-8"))
}

export async function GET() {
  return NextResponse.json(read())
}

export async function PATCH(req: Request) {
  const { section, data } = await req.json()
  const content = read()
  content[section] = data
  writeFileSync(FILE, JSON.stringify(content, null, 2))
  return NextResponse.json({ ok: true })
}
