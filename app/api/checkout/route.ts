import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 })

  const { items, shippingAddress } = await req.json()
  // items: [{ id, name, price, qty, image, weight? }]

  const lineItems = items.map((item: { name: string; price: number; qty: number; image?: string }) => ({
    price_data: {
      currency: "try",
      product_data: {
        name: item.name,
        images: item.image ? [item.image.startsWith("http") ? item.image : `${process.env.NEXT_PUBLIC_SITE_URL}${item.image}`] : [],
      },
      unit_amount: item.price * 100, // kuruşa çevir
    },
    quantity: item.qty,
  }))

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/siparis-tamamlandi?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/sepet`,
    metadata: {
      user_id: user.id,
      items: JSON.stringify(items),
      shipping_address: JSON.stringify(shippingAddress ?? null),
    },
    locale: "tr",
  })

  return NextResponse.json({ url: session.url })
}
