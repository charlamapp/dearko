import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { getProducts, upsertProduct, type Product } from "@/lib/products"

export async function GET() {
  return NextResponse.json(await getProducts())
}

export async function POST(req: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  if (!body?.name || !body?.price) return NextResponse.json({ error: "name ve price zorunlu" }, { status: 400 })
  const newProduct: Product = {
    ...body,
    id: body.id || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
  }
  try {
    await upsertProduct(newProduct)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "kayıt hatası" }, { status: 500 })
  }
  return NextResponse.json(newProduct, { status: 201 })
}
