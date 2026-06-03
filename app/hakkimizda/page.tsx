"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { origins } from "@/lib/data"

type Milestone = { year: string; event: string }
type HakkimizdaData = {
  heroHeadline: string
  storyImage: string
  story1: string
  story2: string
  milestones: Milestone[]
}

export default function HakkimizdaPage() {
  const [data, setData] = useState<HakkimizdaData | null>(null)

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((c) => setData(c.hakkimizda))
  }, [])

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "4rem" }}>

      <section className="pt-14 pb-16" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <p className="label mb-4">Hakkımızda</p>
          <h1 className="heading-xl max-w-2xl">
            {data?.heroHeadline ?? "Kahveye duyduğumuz saygıdan doğduk."}
          </h1>
        </div>
      </section>

      <section className="section" style={{ background: "#FFFFFF" }}>
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={data?.storyImage ?? "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=85"}
              alt="Kavrum Atölyesi"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="label mb-6">Hikayemiz</p>
            <p className="body-lg mb-5">{data?.story1 ?? ""}</p>
            <p className="body-lg">{data?.story2 ?? ""}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#F5F5F5", borderTop: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <p className="label-ink mb-14">Değerlerimiz</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              ["Şeffaflık", "Her kahvenin nereden, kim tarafından ve nasıl işlendiğini bilirsiniz."],
              ["Kalite", "SCA Q Grader sertifikalı ekibimiz her lotu tadarak seçer. 80 puan altı kabul edilmez."],
              ["Adil Ticaret", "Çiftçilere piyasa fiyatının üzerinde ödeme yapıyoruz."],
              ["Sürdürülebilirlik", "Karbon nötr kargo, geri dönüştürülebilir ambalaj."],
            ].map(([title, desc]) => (
              <div key={title} className="p-8 lg:p-10" style={{ border: "1px solid #E8E8E8", background: "#FFFFFF" }}>
                <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#2C2B2B", marginBottom: "0.75rem" }}>
                  {title}
                </h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#6B6868" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#FFFFFF", borderTop: "1px solid #E8E8E8" }}>
        <div className="wrap-narrow">
          <p className="label-ink mb-14">2019'dan Bugüne</p>
          {(data?.milestones ?? []).map(({ year, event }) => (
            <div key={year} className="flex gap-8 py-5" style={{ borderBottom: "1px solid #E8E8E8" }}>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 700, color: "#5CADD4", width: "3rem", flexShrink: 0, paddingTop: "0.1rem" }}>
                {year}
              </span>
              <span style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#2C2B2B" }}>{event}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: "#F5F5F5", borderTop: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <p className="label-ink mb-10">Tedarik Ettiğimiz Ülkeler</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {origins.map((o) => (
              <div key={o.country} className="p-5 text-center" style={{ border: "1px solid #E8E8E8", background: "#FFFFFF" }}>
                <div className="text-3xl mb-2">{o.flag}</div>
                <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "#2C2B2B" }}>{o.country}</div>
                <div style={{ fontSize: "0.65rem", color: "#6B6868", marginTop: "0.15rem" }}>{o.region}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#FFFFFF", borderTop: "1px solid #E8E8E8" }}>
        <div className="wrap flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <h2 className="heading-md">Hikayemizin parçası olun.</h2>
          <div className="flex gap-4 flex-wrap">
            <Link href="/abonelik" className="btn-dark">Abonelik</Link>
            <Link href="/iletisim" className="btn-outline">İletişim</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
