"use client"

import Link from "next/link"
import { useState } from "react"
import { Instagram, Twitter, Youtube } from "lucide-react"

const cols = [
  {
    title: "Mağaza",
    links: [
      { href: "/magazin", label: "Tüm Kahveler" },
      { href: "/magazin?cat=cekirdek", label: "Çekirdekler" },
      { href: "/magazin?cat=equipment", label: "Ekipmanlar" },
      { href: "/abonelik", label: "Abonelik" },
    ],
  },
  {
    title: "Hizmetler",
    links: [
      { href: "/kurumsal", label: "Kurumsal" },
      { href: "/mobil-arac", label: "Mobil Araç" },
      { href: "/rezervasyon", label: "Rezervasyon" },
    ],
  },
  {
    title: "DearKo",
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/iletisim", label: "İletişim" },
      { href: "/iletisim", label: "Kariyer" },
    ],
  },
]

export default function Footer() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  return (
    <footer style={{ background: "#FFFFFF", borderTop: "1px solid #E8E8E8" }}>

      {/* Newsletter */}
      <div className="section-sm" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <p className="label-ink mb-2">Bülten</p>
              <p style={{ fontSize: "0.875rem", color: "#6B6868" }}>
                Yeni hasatlar, etkinlikler ve özel teklifler için abone olun.
              </p>
            </div>
            {done ? (
              <p style={{ fontSize: "0.875rem", color: "#5CADD4", fontFamily: "var(--font-inter)" }}>
                ✓ Abone oldunuz. Teşekkürler!
              </p>
            ) : (
              <form
                className="flex w-full lg:w-auto"
                onSubmit={(e) => { e.preventDefault(); if (email) setDone(true) }}
              >
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input lg:w-72"
                />
                <button type="submit" className="btn-dark flex-shrink-0">
                  Abone Ol
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="section-sm" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex flex-col items-start gap-1 mb-5">
              <svg width="24" height="32" viewBox="0 0 28 38" fill="none">
                <path d="M14 0C8 0 3 5 3 12C3 16 4.5 19.5 7 22L4 34C4 36 6 38 8 38H20C22 38 24 36 24 34L21 22C23.5 19.5 25 16 25 12C25 5 20 0 14 0Z" fill="#5CADD4" />
                <ellipse cx="14" cy="12" rx="6" ry="8" fill="#FFFFFF" />
              </svg>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.28em", color: "#2C2B2B", textTransform: "uppercase" }}>
                DEARKO
              </span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "#6B6868", lineHeight: 1.6, maxWidth: "14rem" }}>
              İstanbul'dan dünyaya, specialty kahvede yeni standart.
            </p>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <p className="label-ink mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      style={{ fontSize: "0.8125rem", color: "#6B6868", textDecoration: "none", transition: "color 0.15s" }}
                      className="hover:text-ink"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="wrap py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p style={{ fontSize: "0.75rem", color: "#6B6868" }}>
          © {new Date().getFullYear()} DearKo Coffee. Tüm hakları saklıdır.
        </p>
        <div className="flex items-center gap-3">
          <a href="#" style={{ color: "#6B6868" }} className="hover:opacity-60 transition-opacity"><Instagram size={15} strokeWidth={1.5} /></a>
          <a href="#" style={{ color: "#6B6868" }} className="hover:opacity-60 transition-opacity"><Twitter size={15} strokeWidth={1.5} /></a>
          <a href="#" style={{ color: "#6B6868" }} className="hover:opacity-60 transition-opacity"><Youtube size={15} strokeWidth={1.5} /></a>
        </div>
      </div>

    </footer>
  )
}
