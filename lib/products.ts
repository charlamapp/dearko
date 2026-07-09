import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { createClient } from "@supabase/supabase-js"

export type Product = {
  id: string
  name: string
  category: "coffee" | "equipment"
  price: number
  image: string
  description: string
  origin?: string
  region?: string
  process?: string
  roast?: string
  flavor?: string[]
  weight?: string
  brand?: string
  images?: string[]
  video?: string
}

const FILE = join(process.cwd(), "data", "products.json")

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function readLocal(): Product[] {
  try { return JSON.parse(readFileSync(FILE, "utf-8")) } catch { return [] }
}

function writeLocal(products: Product[]) {
  writeFileSync(FILE, JSON.stringify(products, null, 2), "utf-8")
}

/**
 * Ürün kaynağı: Supabase `products` tablosu (id + jsonb data) varsa o kullanılır;
 * yoksa data/products.json'a düşülür (yalnızca lokal geliştirme için —
 * Vercel'de dosya sistemi kalıcı değildir). Tabloyu oluşturmak için
 * supabase-products.sql dosyasını çalıştırın.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await sb()
      .from("products")
      .select("id, data")
      .order("created_at", { ascending: true })
    if (!error && data && data.length > 0) {
      return data.map((row) => ({ ...(row.data as Omit<Product, "id">), id: row.id }))
    }
  } catch {}
  return readLocal()
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.id === id) ?? null
}

async function supabaseAvailable(): Promise<boolean> {
  try {
    const { error } = await sb().from("products").select("id", { count: "exact", head: true })
    return !error
  } catch { return false }
}

export async function upsertProduct(product: Product): Promise<void> {
  const { id, ...data } = product
  if (await supabaseAvailable()) {
    const { error } = await sb().from("products").upsert({ id, data })
    if (error) throw new Error(error.message)
    return
  }
  const products = readLocal()
  const idx = products.findIndex((p) => p.id === id)
  if (idx >= 0) products[idx] = product
  else products.push(product)
  writeLocal(products)
}

export async function deleteProduct(id: string): Promise<void> {
  if (await supabaseAvailable()) {
    const { error } = await sb().from("products").delete().eq("id", id)
    if (error) throw new Error(error.message)
    return
  }
  writeLocal(readLocal().filter((p) => p.id !== id))
}
