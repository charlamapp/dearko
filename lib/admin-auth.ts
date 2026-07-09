import { createHmac, timingSafeEqual, randomBytes } from "crypto"
import { cookies } from "next/headers"

export const ADMIN_COOKIE = "dk_admin"
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8 // 8 saat

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET
  if (!s) throw new Error("ADMIN_SESSION_SECRET tanımlı değil")
  return s
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url")
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

export function checkAdminPassword(password: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || typeof password !== "string") return false
  return safeEqual(password, expected)
}

export function createSessionToken(): string {
  const payload = `${Date.now() + ADMIN_SESSION_MAX_AGE * 1000}.${randomBytes(8).toString("hex")}`
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  const i = token.lastIndexOf(".")
  if (i < 0) return false
  const payload = token.slice(0, i)
  if (!safeEqual(token.slice(i + 1), sign(payload))) return false
  const expires = Number(payload.split(".")[0])
  return Number.isFinite(expires) && Date.now() < expires
}

/** Route handler'larda admin oturumunu doğrular (dk_admin çerezi). */
export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies()
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value)
}
