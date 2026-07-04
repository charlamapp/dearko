"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { corporatePlans } from "@/lib/data"

type KurumsalData = { heroImage: string; heroHeadline: string; introText: string }

export default function KurumsalPage() {
  const [data, setData] = useState<KurumsalData | null>(null)

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((c) => setData(c.kurumsal))
  }, [])

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "6.25rem" }}>

      <section className="relative overflow-hidden" style={{ minHeight: "60vh", display: "flex", alignItems: "flex-end" }}>
        <img
          src={data?.heroImage ?? "https://images.unsplash.com/photo-1497935586047-9395ee010a64?w=1600&q=85"}
          alt="Kurumsal"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="relative wrap w-full pb-14 lg:pb-20">
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
            Kurumsal
          </p>
          <h1 className="heading-xl max-w-xl" style={{ color: "#fff" }}>
            {data?.heroHeadline ?? "Çalışanlarınız en iyisini hak ediyor."}
          </h1>
        </div>
      </section>

      <section className="section" style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <h2 className="heading-lg">Specialty kahve,<br />ofise taşıyor.</h2>
          <div>
            <p className="body-lg mb-8">
              {data?.introText ?? "Ofis büyüklüğünüzden bağımsız olarak düzenli taze çekirdek, ekipman desteği ve barista eğitimleriyle kahve kültürünü çalışma ortamınıza getiriyoruz."}
            </p>
            <ul className="space-y-3">
              {[
                "Düzenli taze kavrum teslimatı",
                "Ekipman danışmanlığı ve bakım desteği",
                "Çalışan kahve eğitimleri",
                "Kurumsal fatura ve ödeme kolaylığı",
                "Özel etiket ve ambalaj seçeneği",
              ].map((item) => (
                <li key={item} className="flex gap-3" style={{ fontSize: "0.875rem", color: "#6B6868" }}>
                  <Check size={13} style={{ color: "#5CADD4", flexShrink: 0, marginTop: "0.15rem" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#F5F5F5", borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <p className="label-ink mb-14">Planlar</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {corporatePlans.map((plan) => (
              <div key={plan.id} className="p-8 lg:p-10 flex flex-col" style={{ border: "1px solid #E8E8E8", background: "#FFFFFF" }}>
                <div className="mb-6">
                  <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#2C2B2B", marginBottom: "0.25rem" }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "#6B6868" }}>{plan.capacity}</p>
                </div>
                <div className="mb-6 pb-6" style={{ borderBottom: "1px solid #E8E8E8" }}>
                  {plan.custom ? (
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#5CADD4" }}>
                      Teklif Alın
                    </span>
                  ) : (
                    <>
                      <span style={{ fontFamily: "var(--font-inter)", fontWeight: 800, fontSize: "2.25rem", color: "#2C2B2B", lineHeight: 1, display: "block" }}>
                        ₺{plan.price}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#6B6868" }}>/{plan.period}</span>
                    </>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2.5" style={{ fontSize: "0.8125rem", color: "#6B6868" }}>
                      <Check size={12} style={{ color: "#5CADD4", flexShrink: 0, marginTop: "0.15rem" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/iletisim" className="btn-outline text-center justify-center">
                  {plan.custom ? "Teklif İste" : "Başla"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#FFFFFF" }}>
        <div className="wrap text-center">
          <h2 className="heading-md mb-5">Özel bir çözüm mü arıyorsunuz?</h2>
          <p className="body-lg mb-8">24 saat içinde geri dönüş garantisi.</p>
          <Link href="/iletisim" className="btn-dark">Bize Ulaşın</Link>
        </div>
      </section>

    </div>
  )
}
