import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { getProducts } from "@/lib/products"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

type CheckoutParams = NonNullable<Parameters<typeof stripe.checkout.sessions.create>[0]>
type LineItem = NonNullable<CheckoutParams["line_items"]>[number]

const FREE_SHIPPING_THRESHOLD = 500_00 // kuruş (₺500)
const SHIPPING_FEE = 49_00             // kuruş (₺49)

const grindLabels: Record<string, string> = {
  cekirdek: "Çekirdek", v60: "V60 / Pour-Over", "french-press": "French Press",
  espresso: "Espresso", moka: "Moka Pot",
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 })

  const body = await req.json().catch(() => null)
  const items: { id?: unknown; qty?: unknown; grind?: unknown }[] = Array.isArray(body?.items) ? body.items : []
  if (items.length === 0) return NextResponse.json({ error: "Sepet boş." }, { status: 400 })

  // Fiyatlar istemciden alınmaz — sunucudaki ürün kaynağından doğrulanır.
  const catalog = await getProducts()
  const byId = new Map(catalog.map((p) => [p.id, p]))

  const lineItems: LineItem[] = []
  const orderItems: { id: string; name: string; price: number; qty: number; image: string; grind?: string }[] = []
  let subtotal = 0

  for (const item of items) {
    const product = byId.get(String(item.id ?? ""))
    if (!product) return NextResponse.json({ error: "Sepetteki bir ürün artık mevcut değil. Lütfen sepetinizi güncelleyin." }, { status: 400 })
    const qty = Math.min(99, Math.max(1, Math.round(Number(item.qty)) || 1))
    const grind = typeof item.grind === "string" && grindLabels[item.grind] ? item.grind : undefined
    const unitAmount = Math.round(product.price * 100) // TL → kuruş
    subtotal += unitAmount * qty

    const displayName = product.category === "coffee" && grind
      ? `${product.name} — ${grindLabels[grind]}`
      : product.name

    lineItems.push({
      price_data: {
        currency: "try",
        product_data: {
          name: displayName,
          images: product.image
            ? [product.image.startsWith("http") ? product.image : `${process.env.NEXT_PUBLIC_SITE_URL}${product.image}`]
            : [],
        },
        unit_amount: unitAmount,
      },
      quantity: qty,
    })
    orderItems.push({ id: product.id, name: displayName, price: unitAmount, qty, image: product.image, grind })
  }

  const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    customer_email: user.email,
    shipping_address_collection: { allowed_countries: ["TR"] },
    shipping_options: [{
      shipping_rate_data: {
        display_name: shippingAmount === 0 ? "Ücretsiz Kargo" : "Standart Kargo",
        type: "fixed_amount",
        fixed_amount: { amount: shippingAmount, currency: "try" },
        delivery_estimate: {
          minimum: { unit: "business_day", value: 2 },
          maximum: { unit: "business_day", value: 4 },
        },
      },
    }],
    allow_promotion_codes: true,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/siparis-tamamlandi?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/sepet`,
    metadata: {
      user_id: user.id,
      items: JSON.stringify(orderItems.map(({ id, qty, grind }) => ({ id, qty, grind }))),
    },
    locale: "tr",
  })

  return NextResponse.json({ url: session.url })
}
