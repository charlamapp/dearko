"use client"

import Link from "next/link"
import { useState } from "react"
import { Instagram, Twitter, Youtube } from "lucide-react"

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
              <a href="#" style={{ color: "#8A8A8A", display: "flex" }} className="hover:opacity-60"><Instagram size={16} strokeWidth={1.5} /></a>
              <a href="#" style={{ color: "#8A8A8A", display: "flex" }} className="hover:opacity-60"><Twitter size={16} strokeWidth={1.5} /></a>
              <a href="#" style={{ color: "#8A8A8A", display: "flex" }} className="hover:opacity-60"><Youtube size={16} strokeWidth={1.5} /></a>
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
