import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Sipariş onay sayfası: ödemenin gerçekten tamamlandığını doğrular ve özeti döner.
export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 })

  const sessionId = new URL(req.url).searchParams.get("session_id")
  if (!sessionId) return NextResponse.json({ error: "session_id eksik" }, { status: 400 })

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] })
  } catch {
    return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 404 })
  }

  if (session.metadata?.user_id && session.metadata.user_id !== user.id) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const paid = session.payment_status === "paid"
  return NextResponse.json({
    paid,
    total: session.amount_total ?? 0, // kuruş
    email: session.customer_details?.email ?? null,
    name: session.customer_details?.name ?? null,
    items: (session.line_items?.data ?? []).map((li) => ({
      name: li.description,
      qty: li.quantity ?? 1,
      amount: li.amount_total, // kuruş
    })),
  })
}
