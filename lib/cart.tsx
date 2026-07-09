"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type CartItem = {
  key: string        // id + öğütme kombinasyonu — aynı kahvenin farklı öğütmeleri ayrı satırdır
  id: string
  name: string
  price: number
  qty: number
  image: string
  weight?: string
  grind?: string
}

type NewItem = Omit<CartItem, "qty" | "key"> & { qty?: number }

type CartCtx = {
  items: CartItem[]
  add: (item: NewItem) => void
  remove: (key: string) => void
  update: (key: string, qty: number) => void
  clear: () => void
  count: number
  total: number
}

const CartContext = createContext<CartCtx | null>(null)

function lineKey(id: string, grind?: string) {
  return grind ? `${id}::${grind}` : id
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("dk-cart")
      if (stored) {
        const parsed = JSON.parse(stored) as (CartItem & { key?: string })[]
        // Eski format (key alanı yok) → taşı
        setItems(parsed.map((i) => ({ ...i, key: i.key ?? lineKey(i.id, i.grind) })))
      }
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) localStorage.setItem("dk-cart", JSON.stringify(items))
  }, [items, ready])

  function add(item: NewItem) {
    const key = lineKey(item.id, item.grind)
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) return prev.map((i) => i.key === key ? { ...i, qty: i.qty + (item.qty ?? 1) } : i)
      return [...prev, { ...item, key, qty: item.qty ?? 1 }]
    })
  }

  function remove(key: string) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function update(key: string, qty: number) {
    if (qty <= 0) { remove(key); return }
    setItems((prev) => prev.map((i) => i.key === key ? { ...i, qty } : i))
  }

  function clear() { setItems([]) }

  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, update, clear, count, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
