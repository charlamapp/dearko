"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { vehicleServices } from "@/lib/data"

type PriceRow = { label: string; price: string }
type MobilAracData = {
  heroImage: string; heroHeadline: string; baseFiyat: string
  pricing: PriceRow[]; gallery: string[]
}

export default function MobilAracPage() {
  const [data, setData] = useState<MobilAracData | null>(null)

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((c) => setData(c.mobilArac))
  }, [])

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "5.5rem" }}>

      <section className="relative overflow-hidden" style={{ minHeight: "80vh", display: "flex", alignItems: "flex-end" }}>
        <img
          src={data?.heroImage ?? "https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?w=1600&q=85"}
          alt="Mobil Kahve Aracı"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="relative wrap w-full pb-14 lg:pb-20">
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
            Mobil Kahve Aracı
          </p>
          <h1 className="heading-xl max-w-xl mb-8" style={{ color: "#fff" }}>
            {data?.heroHeadline ?? "Kahveyi siz değil, biz getiririz."}
          </h1>
          <Link href="/rezervasyon" className="btn-white">Rezervasyon Yap</Link>
        </div>
      </section>

      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap grid grid-cols-3 gap-8 py-10 text-center">
          {[["500+", "Etkinlik"], ["50.000+", "Fincan"], ["4.9★", "Ortalama Puan"]].map(([v, l]) => (
            <div key={l}>
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "#2C2B2B", lineHeight: 1, marginBottom: "0.4rem" }}>{v}</p>
              <p className="label-muted">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="section" style={{ background: "#FFFFFF" }}>
        <div className="wrap">
          <p className="label-ink mb-14">Hizmetler</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {vehicleServices.map((svc) => (
              <div key={svc.id} className="p-8 lg:p-10" style={{ border: "1px solid #E8E8E8" }}>
                <div className="text-4xl mb-5">{svc.icon}</div>
                <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#2C2B2B", marginBottom: "0.5rem" }}>
                  {svc.name}
                </h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#6B6868" }}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {data && data.gallery.length > 0 && (
        <section className="section-sm" style={{ background: "#F5F5F5", borderTop: "1px solid #E8E8E8" }}>
          <div className="wrap">
            <p className="label-ink mb-10">Galeri</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.gallery.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden">
                  <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ background: "#FFFFFF", borderTop: "1px solid #E8E8E8" }}>
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="label mb-4">Fiyatlandırma</p>
            <h2 className="heading-lg mb-3">
              Başlayan fiyat<br />{data?.baseFiyat ?? "₺2.500 / 2 saat"}.
            </h2>
            <p className="body-lg mb-10">Profesyonel barista ve tam ekipman dahil.</p>
            <Link href="/rezervasyon" className="btn-dark">Rezervasyon Yap</Link>
          </div>
          <div style={{ borderTop: "1px solid #E8E8E8" }}>
            {(data?.pricing ?? []).map(({ label, price }) => (
              <div key={label} className="flex justify-between py-4" style={{ borderBottom: "1px solid #E8E8E8" }}>
                <span style={{ fontSize: "0.875rem", color: "#6B6868" }}>{label}</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 600, color: "#2C2B2B" }}>{price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
