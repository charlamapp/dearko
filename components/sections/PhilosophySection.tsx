const stats = [
  { value: "5.000+", label: "Aktif Abone", desc: "Düzenli kahve tutkunları" },
  { value: "12",     label: "Ülkeden Origin", desc: "Küresel çiftçi ağı" },
  { value: "500+",   label: "Etkinlik", desc: "Mobil araç hizmetleri" },
  { value: "48sa",   label: "İçinde Kargo", desc: "Taze kavrum garantisi" },
]

const steps = [
  { num: "01", title: "Hasat", desc: "Dünyanın en iyi bölgelerindeki çiftçilerle direkt ilişki." },
  { num: "02", title: "Kavrum", desc: "İstanbul'daki atölyemizde sipariş sonrası taze kavrum." },
  { num: "03", title: "Kapınızda", desc: "48 saat içinde vakumlu ambalajıyla taze teslimat." },
]

export default function PhilosophySection() {
  return (
    <>
      {/* İstatistikler */}
      <section style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: "1px solid #E8E8E8" }}>
            {stats.map((s, i) => (
              <div key={s.label} className="py-10 px-4 lg:px-8 text-center"
                style={{ borderRight: i < stats.length - 1 ? "1px solid #E8E8E8" : "none" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 900, fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "#2C2B2B", lineHeight: 1, marginBottom: "0.5rem" }}>
                  {s.value}
                </p>
                <p className="label-ink mb-1">{s.label}</p>
                <p style={{ fontSize: "0.75rem", color: "#A0A0A0" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nasıl çalışır */}
      <section className="section" style={{ background: "#F8F8F8", borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <div className="text-center mb-16">
            <p className="label mb-4">Süreç</p>
            <h2 className="heading-lg">Çiftlikten Fincanınıza</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            {/* Bağlantı çizgisi (desktop) */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px" style={{ background: "#E8E8E8", zIndex: 0 }} />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center px-8 py-8">
                <div className="w-16 h-16 flex items-center justify-center mb-6 relative"
                  style={{ background: "#5CADD4" }}>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>
                    {s.num}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#2C2B2B", marginBottom: "0.75rem" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#6B6868", lineHeight: 1.7, maxWidth: "18rem" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
