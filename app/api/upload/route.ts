import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { isAdminRequest } from "@/lib/admin-auth"

export async function POST(req: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const form = await req.formData()
  const file = form.get("file") as File | null

  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 })

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  })

  return NextResponse.json({ url: blob.url })
}
