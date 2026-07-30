"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, ShoppingBag, Menu, X, LogOut, ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCart } from "@/lib/cart"
import { createClient } from "@/lib/supabase/client"

const leftLinks = [
  { href: "/magazin",    label: "Kahveler" },
  { href: "/quiz",       label: "Kahveni Bul" },
  { href: "/abonelik",   label: "Abonelik" },
]

const rightLinks = [
  { href: "/kurumsal",   label: "Kurumsal" },
  { href: "/mobil-arac", label: "Mobil Araç" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim",   label: "İletişim" },
]

const allLinks = [...leftLinks, ...rightLinks]

const announcements = [
  "🚚  ₺500 üzeri siparişlerde Türkiye geneli ücretsiz kargo",
  "☕  Siparişten sonra kavrulur — 48 saat içinde kapınızda",
  "✨  Yeni hasat: Etiyopya Yirgacheffe stokta!",
]

export default function Header() {
  const [open, setOpen]                 = useState(false)
  const [userEmail, setUserEmail]       = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [annIdx, setAnnIdx]             = useState(0)
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

  useEffect(() => {
    const t = setInterval(() => setAnnIdx((i) => (i + 1) % announcements.length), 4500)
    return () => clearInterval(t)
  }, [])

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserEmail(null); setUserMenuOpen(false)
    router.push("/"); router.refresh()
  }

  const linkStyle = (href: string) => ({
    fontFamily: "var(--font-inter)",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    color: pathname === href ? "#6C8145" : "#2C2B2B",
    padding: "0.25rem 0",
    borderBottom: pathname === href ? "1.5px solid #6C8145" : "1.5px solid transparent",
    transition: "color 0.18s, border-color 0.18s",
    whiteSpace: "nowrap" as const,
  })

  return (
    <>
      {/* Duyuru çubuğu */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-11 px-4"
        style={{ background: "#6C8145" }}>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)", fontWeight: 600, letterSpacing: "0.02em", color: "#fff", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
          {announcements[annIdx]}
        </p>
      </div>

      {/* Ana header */}
      <header className="fixed top-11 left-0 right-0 z-50 h-16"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8" }}>

        {/* ── Desktop layout ── */}
        <div className="hidden lg:grid h-full px-6 xl:px-12"
          style={{ gridTemplateColumns: "1fr auto 1fr", alignItems: "center", maxWidth: "100%" }}>

          {/* Sol nav */}
          <nav className="flex items-center gap-6 xl:gap-8">
            {leftLinks.map(({ href, label }) => (
              <Link key={href} href={href} style={linkStyle(href)}
                onMouseEnter={e => { if (pathname !== href) (e.currentTarget as HTMLElement).style.color = "#6C8145" }}
                onMouseLeave={e => { if (pathname !== href) (e.currentTarget as HTMLElement).style.color = "#2C2B2B" }}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Merkez logo */}
          <Link href="/" className="flex flex-col items-center gap-1 no-underline mx-8 xl:mx-14"
            style={{ textDecoration: "none" }}>
            <svg width="30" height="40" viewBox="0 0 28 38" fill="none">
              <path d="M14 0C8 0 3 5 3 12C3 16 4.5 19.5 7 22L4 34C4 36 6 38 8 38H20C22 38 24 36 24 34L21 22C23.5 19.5 25 16 25 12C25 5 20 0 14 0Z" fill="#6C8145" />
              <ellipse cx="14" cy="12" rx="6" ry="8" fill="#FFFFFF" />
            </svg>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.35em", color: "#1A1919", textTransform: "uppercase" }}>
              MOLA
            </span>
          </Link>

          {/* Sağ nav + ikonlar */}
          <div className="flex items-center justify-end gap-6 xl:gap-8">
            <nav className="flex items-center gap-6 xl:gap-8">
              {rightLinks.map(({ href, label }) => (
                <Link key={href} href={href} style={linkStyle(href)}
                  onMouseEnter={e => { if (pathname !== href) (e.currentTarget as HTMLElement).style.color = "#6C8145" }}
                  onMouseLeave={e => { if (pathname !== href) (e.currentTarget as HTMLElement).style.color = "#2C2B2B" }}>
                  {label}
                </Link>
              ))}
            </nav>

            {/* İkonlar */}
            <div className="flex items-center gap-0.5 ml-2">
              <div className="relative">
                {userEmail ? (
                  <>
                    <button onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex w-10 h-10 items-center justify-center hover:opacity-60"
                      style={{ color: "#2C2B2B", background: "none", border: "none", cursor: "pointer" }}>
                      <User size={18} strokeWidth={1.75} />
                    </button>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <div className="absolute right-0 top-12 z-50 w-52 py-1"
                          style={{ background: "#FFFFFF", border: "1px solid #EBEBEB", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
                          <p style={{ padding: "0.6rem 1rem", fontSize: "0.72rem", color: "#6B6868", borderBottom: "1px solid #F0F0F0" }}>
                            {userEmail}
                          </p>
                          <Link href="/hesabim" onClick={() => setUserMenuOpen(false)}
                            style={{ display: "block", padding: "0.7rem 1rem", fontSize: "0.8125rem", fontFamily: "var(--font-inter)", fontWeight: 500, color: "#2C2B2B", textDecoration: "none" }}
                            className="hover:bg-[#F8F8F8]">Hesabım</Link>
                          <Link href="/hesabim" onClick={() => setUserMenuOpen(false)}
                            style={{ display: "block", padding: "0.7rem 1rem", fontSize: "0.8125rem", fontFamily: "var(--font-inter)", fontWeight: 500, color: "#2C2B2B", textDecoration: "none", borderTop: "1px solid #F0F0F0" }}
                            className="hover:bg-[#F8F8F8]">Siparişlerim</Link>
                          <button onClick={logout}
                            style={{ display: "flex", alignItems: "center", gap: "0.4rem", width: "100%", padding: "0.7rem 1rem", fontSize: "0.8125rem", fontFamily: "var(--font-inter)", fontWeight: 500, color: "#6B6868", background: "none", border: "none", cursor: "pointer", borderTop: "1px solid #F0F0F0" }}
                            className="hover:bg-[#F8F8F8]">
                            <LogOut size={13} /> Çıkış Yap
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Link href="/giris" className="flex w-10 h-10 items-center justify-center hover:opacity-60" style={{ color: "#2C2B2B" }}>
                    <User size={18} strokeWidth={1.75} />
                  </Link>
                )}
              </div>

              <Link href="/sepet" className="flex w-10 h-10 items-center justify-center relative" style={{ color: "#2C2B2B" }}>
                <ShoppingBag size={20} strokeWidth={1.75} />
                {count > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-white"
                    style={{ background: "#6C8145", fontSize: "0.58rem", fontWeight: 700, fontFamily: "var(--font-inter)", borderRadius: "50%" }}>
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="lg:hidden h-full flex items-center justify-between px-4">
          <button onClick={() => setOpen(true)}
            className="flex w-10 h-10 items-center justify-center -ml-2"
            style={{ color: "#2C2B2B" }} aria-label="Menüyü aç">
            <Menu size={20} strokeWidth={1.75} />
          </button>

          <Link href="/" className="flex flex-col items-center gap-0.5 no-underline" style={{ textDecoration: "none" }}>
            <svg width="24" height="32" viewBox="0 0 28 38" fill="none">
              <path d="M14 0C8 0 3 5 3 12C3 16 4.5 19.5 7 22L4 34C4 36 6 38 8 38H20C22 38 24 36 24 34L21 22C23.5 19.5 25 16 25 12C25 5 20 0 14 0Z" fill="#6C8145" />
              <ellipse cx="14" cy="12" rx="6" ry="8" fill="#FFFFFF" />
            </svg>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.52rem", fontWeight: 800, letterSpacing: "0.3em", color: "#1A1919", textTransform: "uppercase" }}>
              MOLA
            </span>
          </Link>

          <div className="flex items-center">
            <Link href="/sepet" className="flex w-10 h-10 items-center justify-center relative" style={{ color: "#2C2B2B" }}>
              <ShoppingBag size={20} strokeWidth={1.75} />
              {count > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-white"
                  style={{ background: "#6C8145", fontSize: "0.58rem", fontWeight: 700, fontFamily: "var(--font-inter)", borderRadius: "50%" }}>
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobil drawer */}
      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-[300px] flex flex-col"
            style={{ background: "#FFFFFF", boxShadow: "4px 0 40px rgba(0,0,0,0.12)" }}>

            <div className="flex items-center justify-between px-5 h-16" style={{ borderBottom: "1px solid #F0F0F0" }}>
              <div className="flex items-center gap-2.5">
                <svg width="20" height="28" viewBox="0 0 28 38" fill="none">
                  <path d="M14 0C8 0 3 5 3 12C3 16 4.5 19.5 7 22L4 34C4 36 6 38 8 38H20C22 38 24 36 24 34L21 22C23.5 19.5 25 16 25 12C25 5 20 0 14 0Z" fill="#6C8145" />
                  <ellipse cx="14" cy="12" rx="6" ry="8" fill="#FFFFFF" />
                </svg>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: "#1A1919" }}>MOLA</span>
              </div>
              <button onClick={() => setOpen(false)} style={{ color: "#6B6868", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}>
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex flex-col px-3 py-4 flex-1 overflow-y-auto">
              {allLinks.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-4"
                  style={{
                    fontFamily: "var(--font-inter)", fontSize: "0.9375rem", fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.04em",
                    color: pathname === href ? "#6C8145" : "#2C2B2B",
                    textDecoration: "none", borderBottom: "1px solid #F5F5F5",
                  }}>
                  {label}
                  <ChevronRight size={14} style={{ color: "#D0D0D0" }} />
                </Link>
              ))}
            </nav>

            <div className="px-4 py-5" style={{ borderTop: "1px solid #F0F0F0" }}>
              {userEmail ? (
                <>
                  <p style={{ fontSize: "0.72rem", color: "#6B6868", marginBottom: "0.75rem" }}>{userEmail}</p>
                  <Link href="/hesabim" onClick={() => setOpen(false)}
                    className="btn-dark w-full justify-center flex items-center gap-2 mb-2"
                    style={{ textDecoration: "none" }}>
                    <User size={14} /> Hesabım
                  </Link>
                  <button onClick={() => { logout(); setOpen(false) }}
                    className="flex items-center gap-2 w-full justify-center py-2.5"
                    style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6B6868", background: "none", border: "1px solid #E8E8E8", cursor: "pointer" }}>
                    <LogOut size={14} /> Çıkış Yap
                  </button>
                </>
              ) : (
                <Link href="/giris" onClick={() => setOpen(false)}
                  className="btn-dark w-full justify-center flex items-center gap-2"
                  style={{ textDecoration: "none" }}>
                  <User size={14} /> Giriş Yap / Üye Ol
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
