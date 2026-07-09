import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  ADMIN_COOKIE, ADMIN_SESSION_MAX_AGE,
  checkAdminPassword, createSessionToken, isAdminRequest,
} from "@/lib/admin-auth"

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
}

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}))
  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 })
  }
  const store = await cookies()
  store.set(ADMIN_COOKIE, createSessionToken(), { ...cookieOptions, maxAge: ADMIN_SESSION_MAX_AGE })
  return NextResponse.json({ ok: true })
}

export async function GET() {
  return NextResponse.json({ authed: await isAdminRequest() })
}

export async function DELETE() {
  const store = await cookies()
  store.set(ADMIN_COOKIE, "", { ...cookieOptions, maxAge: 0 })
  return NextResponse.json({ ok: true })
}
