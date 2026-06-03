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

export async function GET() {
  return NextResponse.json(read())
}

export async function POST(req: Request) {
  const body = await req.json()
  const products = read()
  const newProduct = { ...body, id: body.id || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }
  products.push(newProduct)
  write(products)
  return NextResponse.json(newProduct, { status: 201 })
}
