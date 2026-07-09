import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { getProductById, upsertProduct, deleteProduct } from "@/lib/products"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const existing = await getProductById(id)
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 })
  const updated = { ...existing, ...body, id }
  try {
    await upsertProduct(updated)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "kayıt hatası" }, { status: 500 })
  }
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  try {
    await deleteProduct(id)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "silme hatası" }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
