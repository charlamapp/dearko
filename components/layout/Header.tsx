"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, ShoppingBag, Menu, X, LogOut, ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCart } from "@/lib/cart"
import { createClient } from "@/lib/supabase/client"

const navLinks = [
  { href: "/magazin",    label: "Kahveler" },
  { href: "/abonelik",   label: "Abonelik" },
  { href: "/kurumsal",   label: "Kurumsal" },
  { href: "/mobil-arac", label: "Mobil Araç" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim",   label: "İletişim" },
]

export default function Header() {
  const [open, setOpen]             = useState(false)
  const [userEmail, setUserEmail]   = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { count } = useCart()
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUserEmail(user?.email ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserEmail(null); setUserMenuOpen(false)
    router.push("/"); router.refresh()
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap h-full flex items-center justify-between relative">

          {/* Mobilde SOL: hamburger — masaüstünde: nav */}
          <div className="flex items-center">
            <button onClick={() => setOpen(true)}
              className="lg:hidden flex w-10 h-10 items-center justify-center -ml-1"
              style={{ color: "#2C2B2B" }}>
              <Menu size={20} strokeWidth={1.75} />
            </button>
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.slice(0, 4).map(({ href, label }) => (
                <Link key={href} href={href} className={pathname === href ? "nav-link-active" : "nav-link"}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Merkez: logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 no-underline">
            <svg width="28" height="38" viewBox="0 0 28 38" fill="none">
              <path d="M14 0C8 0 3 5 3 12C3 16 4.5 19.5 7 22L4 34C4 36 6 38 8 38H20C22 38 24 36 24 34L21 22C23.5 19.5 25 16 25 12C25 5 20 0 14 0Z" fill="#5CADD4" />
              <ellipse cx="14" cy="12" rx="6" ry="8" fill="#FFFFFF" />
            </svg>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.28em", color: "#2C2B2B", textTransform: "uppercase" }}>
              DEARKO
            </span>
          </Link>

          {/* SAĞ: kullanıcı + sepet */}
          <div className="flex items-center gap-1">
            {/* Kullanıcı — masaüstü */}
            <div className="relative hidden sm:block">
              {userEmail ? (
                <>
                  <button onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex w-10 h-10 items-center justify-center hover:opacity-60"
                    style={{ color: "#2C2B2B", background: "none", border: "none", cursor: "pointer" }}>
                    <User size={17} strokeWidth={1.75} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-11 z-50 w-48 py-1"
                      style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                      <p style={{ padding: "0.5rem 1rem", fontSize: "0.72rem", color: "#6B6868", borderBottom: "1px solid #E8E8E8" }}>
                        {userEmail}
                      </p>
                      <Link href="/hesabim" onClick={() => setUserMenuOpen(false)}
                        style={{ display: "block", padding: "0.625rem 1rem", fontSize: "0.8125rem", fontFamily: "var(--font-inter)", fontWeight: 500, color: "#2C2B2B", textDecoration: "none" }}
                        className="hover:bg-[#F5F5F5]">Hesabım</Link>
                      <button onClick={logout}
                        style={{ display: "flex", alignItems: "center", gap: "0.4rem", width: "100%", padding: "0.625rem 1rem", fontSize: "0.8125rem", fontFamily: "var(--font-inter)", fontWeight: 500, color: "#6B6868", background: "none", border: "none", cursor: "pointer", borderTop: "1px solid #E8E8E8" }}
                        className="hover:bg-[#F5F5F5]">
                        <LogOut size={13} /> Çıkış Yap
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/giris" className="flex w-10 h-10 items-center justify-center hover:opacity-60" style={{ color: "#2C2B2B" }}>
                  <User size={17} strokeWidth={1.75} />
                </Link>
              )}
            </div>

            {/* Sepet */}
            <Link href="/sepet" className="flex w-10 h-10 items-center justify-center relative" style={{ color: "#2C2B2B" }}>
              <ShoppingBag size={20} strokeWidth={1.75} />
              {count > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-white"
                  style={{ background: "#5CADD4", fontSize: "0.6rem", fontWeight: 700, fontFamily: "var(--font-inter)", borderRadius: "50%" }}>
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
          </div>

        </div>
      </header>

      {/* Mobil drawer — sol'dan açılır */}
      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-[280px] flex flex-col"
            style={{ background: "#FFFFFF", borderRight: "1px solid #E8E8E8" }}>

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-16" style={{ borderBottom: "1px solid #E8E8E8" }}>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#2C2B2B" }}>
                MENÜ
              </span>
              <button onClick={() => setOpen(false)} style={{ color: "#6B6868", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}>
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col px-2 py-4 flex-1 overflow-y-auto">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-4"
                  style={{
                    fontFamily: "var(--font-inter)", fontSize: "0.9375rem", fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.04em",
                    color: pathname === href ? "#2C2B2B" : "#6B6868",
                    textDecoration: "none", borderBottom: "1px solid #E8E8E8",
                    background: pathname === href ? "#F5F5F5" : "transparent",
                  }}>
                  {label}
                  <ChevronRight size={14} style={{ color: "#E8E8E8" }} />
                </Link>
              ))}
            </nav>

            {/* Alt: hesap */}
            <div className="px-2 py-4" style={{ borderTop: "1px solid #E8E8E8" }}>
              {userEmail ? (
                <>
                  <div className="px-4 py-2 mb-1">
                    <p style={{ fontSize: "0.72rem", color: "#6B6868" }}>{userEmail}</p>
                  </div>
                  <Link href="/hesabim" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 600, color: "#2C2B2B", textDecoration: "none" }}>
                    <User size={16} /> Hesabım
                  </Link>
                  <button onClick={() => { logout(); setOpen(false) }}
                    className="flex items-center gap-3 px-4 py-3 w-full"
                    style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 600, color: "#6B6868", background: "none", border: "none", cursor: "pointer" }}>
                    <LogOut size={16} /> Çıkış Yap
                  </button>
                </>
              ) : (
                <Link href="/giris" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 btn-dark mx-2 justify-center"
                  style={{ textDecoration: "none" }}>
                  <User size={16} /> Giriş Yap / Üye Ol
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  )
}
