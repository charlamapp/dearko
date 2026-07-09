import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { getProducts } from "@/lib/products"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Webhook için admin client (cookie'siz)
function adminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const grindLabels: Record<string, string> = {
  cekirdek: "Çekirdek", v60: "V60 / Pour-Over", "french-press": "French Press",
  espresso: "Espresso", moka: "Moka Pot",
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

    // Sipariş kalemleri: metadata'daki {id, qty, grind} listesi ürün
    // kaynağından ad/fiyat/görsel ile zenginleştirilir.
    const compact: { id: string; qty: number; grind?: string }[] =
      JSON.parse(session.metadata?.items ?? "[]")
    const catalog = await getProducts()
    const byId = new Map(catalog.map((p) => [p.id, p]))

    const items = compact.map((c) => {
      const p = byId.get(c.id)
      const name = p
        ? (p.category === "coffee" && c.grind ? `${p.name} — ${grindLabels[c.grind] ?? c.grind}` : p.name)
        : c.id
      return {
        id: c.id,
        name,
        qty: c.qty,
        grind: c.grind ?? null,
        price: p ? Math.round(p.price * 100) : 0, // kuruş
        image: p?.image ?? "",
      }
    })

    // Kargo adresi: yeni Stripe API'lerinde collected_information altında,
    // eskilerinde doğrudan session üzerinde gelir.
    const s = session as Stripe.Checkout.Session & {
      collected_information?: { shipping_details?: { name?: string; address?: Stripe.Address } }
      shipping_details?: { name?: string; address?: Stripe.Address }
    }
    const shipping = s.collected_information?.shipping_details ?? s.shipping_details ?? null
    const shippingAddress = shipping ? {
      name: shipping.name ?? session.customer_details?.name ?? null,
      ...shipping.address,
    } : null

    await supabase.from("orders").insert({
      user_id: session.metadata?.user_id,
      stripe_session_id: session.id,
      status: "paid",
      total: session.amount_total ?? 0,
      items,
      shipping_address: shippingAddress,
    })
  }

  return NextResponse.json({ ok: true })
}
