import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Webhook için admin client (cookie'siz)
function adminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Webhook signature failed" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const supabase = adminClient()

    const items = JSON.parse(session.metadata?.items ?? "[]")
    const shippingAddress = session.metadata?.shipping_address
      ? JSON.parse(session.metadata.shipping_address)
      : null

    const total = session.amount_total ?? 0

    await supabase.from("orders").insert({
      user_id: session.metadata?.user_id,
      stripe_session_id: session.id,
      status: "paid",
      total,
      items,
      shipping_address: shippingAddress,
    })
  }

  return NextResponse.json({ ok: true })
}

export const config = { api: { bodyParser: false } }
