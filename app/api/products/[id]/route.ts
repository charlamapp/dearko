import { NextResponse } from "next/server"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const FILE = join(process.cwd(), "data", "products.json")

function read() {
  return JSON.parse(readFileSync(FILE, "utf-8"))
}
function write(data: unknown) {
  writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8")
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const products = read()
  const idx = products.findIndex((p: { id: string }) => p.id === id)
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 })
  products[idx] = { ...products[idx], ...body }
  write(products)
  return NextResponse.json(products[idx])
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const products = read()
  const filtered = products.filter((p: { id: string }) => p.id !== id)
  write(filtered)
  return NextResponse.json({ ok: true })
}
