import Link from "next/link"
import { origins } from "@/lib/data"

export default function OriginsSection() {
  return (
    <section className="section" style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8" }}>
      <div className="wrap">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Sol: metin */}
          <div>
            <p className="label mb-5">Direkt Ticaret</p>
            <h2 className="heading-lg mb-7">12 Ülke,<br />Tek Fincan.</h2>
            <p className="body-xl mb-8">
              Her partnerimizle doğrudan ilişki kurarak dünyanın en iyi kahve bölgelerinden
              hasat eden çiftçilere adil fiyat ödüyoruz. Çekirdek bizim elimize geçtiğinde
              nerede, kim tarafından ve nasıl yetiştirildiğini biliyoruz.
            </p>
            <div className="flex flex-wrap gap-2 mb-10">
              {origins.map((o) => (
                <span key={o.country}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", border: "1px solid #E8E8E8", padding: "0.35rem 0.75rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 500, color: "#6B6868" }}>
                  <span style={{ fontSize: "1rem" }}>{o.flag}</span> {o.country}
                </span>
              ))}
            </div>
            <Link href="/hakkimizda" className="btn-outline">Hikayemiz</Link>
          </div>

          {/* Sağ: atmosferik görsel */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden" style={{ background: "#F5F5F5" }}>
              <img
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=900&q=85"
                alt="Kahve çiftçisi"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating stat */}
            <div className="absolute -bottom-4 -left-4 lg:-left-8 p-5"
              style={{ background: "#5CADD4", minWidth: "140px" }}>
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 900, fontSize: "2rem", color: "#fff", lineHeight: 1, marginBottom: "0.2rem" }}>12</p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>Ülkeden Origin</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
