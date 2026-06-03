"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  qty: number
  image: string
  weight?: string
  grind?: string
}

type CartCtx = {
  items: CartItem[]
  add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void
  remove: (id: string) => void
  update: (id: string, qty: number) => void
  clear: () => void
  count: number
  total: number
}

const CartContext = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("dk-cart")
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) localStorage.setItem("dk-cart", JSON.stringify(items))
  }, [items, ready])

  function add(item: Omit<CartItem, "qty"> & { qty?: number }) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + (item.qty ?? 1) } : i)
      return [...prev, { ...item, qty: item.qty ?? 1 }]
    })
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function update(id: string, qty: number) {
    if (qty <= 0) { remove(id); return }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i))
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
