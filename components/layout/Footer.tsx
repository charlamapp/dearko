"use client"

import Link from "next/link"
import { useState } from "react"
// Instagram, Twitter, Youtube removed from lucide-react v1+ (trademark) — using inline SVGs
const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const IconYoutube = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
)

const cols = [
  {
    title: "Mağaza",
    links: [
      { href: "/magazin",    label: "Tüm Kahveler" },
      { href: "/magazin",    label: "Tek Köken" },
      { href: "/magazin",    label: "Ekipmanlar" },
      { href: "/abonelik",   label: "Abonelik" },
    ],
  },
  {
    title: "Hizmetler",
    links: [
      { href: "/kurumsal",   label: "Kurumsal" },
      { href: "/mobil-arac", label: "Mobil Araç" },
      { href: "/rezervasyon", label: "Rezervasyon" },
    ],
  },
  {
    title: "DearKo",
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/iletisim",   label: "İletişim" },
      { href: "/iletisim",   label: "Kariyer" },
      { href: "/admin",      label: "Yönetim Paneli" },
    ],
  },
]

export default function Footer() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  return (
    <footer style={{ background: "#FFFFFF", borderTop: "1px solid #E8E8E8" }}>

      {/* Bülten */}
      <div className="section-sm" style={{ background: "#F8F8F8", borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <p className="label mb-2">Bülten</p>
              <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "1.25rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.01em", color: "#2C2B2B", marginBottom: "0.4rem" }}>
                Taze Haberler, Önce Size
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#6B6868" }}>
                Yeni hasatlar, sınırlı seri kavrumlar ve özel teklifler için abone olun.
              </p>
            </div>
            {done ? (
              <p style={{ fontSize: "0.875rem", color: "#5CADD4", fontFamily: "var(--font-inter)", fontWeight: 600, flexShrink: 0 }}>
                ✓ Abone oldunuz. Teşekkürler!
              </p>
            ) : (
              <form className="flex w-full lg:w-auto gap-0" onSubmit={(e) => { e.preventDefault(); if (email) setDone(true) }}>
                <input
                  type="email" placeholder="E-posta adresiniz"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input" style={{ minWidth: "240px" }}
                />
                <button type="submit" className="btn-dark flex-shrink-0">Abone Ol</button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Link kolonları */}
      <div className="section-sm" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">

          {/* Brand */}
          <div>
            <div className="flex flex-col items-start gap-1.5 mb-6">
              <svg width="26" height="35" viewBox="0 0 28 38" fill="none">
                <path d="M14 0C8 0 3 5 3 12C3 16 4.5 19.5 7 22L4 34C4 36 6 38 8 38H20C22 38 24 36 24 34L21 22C23.5 19.5 25 16 25 12C25 5 20 0 14 0Z" fill="#5CADD4" />
                <ellipse cx="14" cy="12" rx="6" ry="8" fill="#FFFFFF" />
              </svg>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.3em", color: "#2C2B2B", textTransform: "uppercase" }}>
                DEARKO
              </span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "#8A8A8A", lineHeight: 1.7, maxWidth: "14rem" }}>
              İstanbul'dan dünyaya, specialty kahvede yeni standart. 2019'dan bu yana.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" style={{ color: "#8A8A8A", display: "flex" }} className="hover:opacity-60"><IconInstagram /></a>
              <a href="#" style={{ color: "#8A8A8A", display: "flex" }} className="hover:opacity-60"><IconX /></a>
              <a href="#" style={{ color: "#8A8A8A", display: "flex" }} className="hover:opacity-60"><IconYoutube /></a>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <p className="label-ink mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href}
                      style={{ fontSize: "0.8125rem", color: "#6B6868", textDecoration: "none" }}
                      className="hover:text-[#2C2B2B] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Alt çubuk */}
      <div className="wrap py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p style={{ fontSize: "0.75rem", color: "#A0A0A0" }}>
          © {new Date().getFullYear()} DearKo Coffee. Tüm hakları saklıdır.
        </p>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "0.72rem", color: "#C0C0C0", fontFamily: "var(--font-inter)" }}>Güvenli ödeme:</span>
          {/* Visa / MC / iyzico placeholder */}
          {["VISA", "MC", "3D"].map((b) => (
            <span key={b} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid #E8E8E8", padding: "0.15rem 0.5rem", fontSize: "0.6rem", fontFamily: "var(--font-inter)", fontWeight: 800, letterSpacing: "0.05em", color: "#A0A0A0", background: "#FAFAFA" }}>
              {b}
            </span>
          ))}
        </div>
      </div>

    </footer>
  )
}
