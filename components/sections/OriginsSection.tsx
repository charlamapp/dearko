import { origins } from "@/lib/data"

export default function OriginsSection() {
  return (
    <section className="section" style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8" }}>
      <div className="wrap">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          <div>
            <p className="label mb-4">Köklerimiz</p>
            <h2 className="heading-lg mb-6">12 Ülke,<br />Tek Fincan.</h2>
            <p className="body-lg mb-0">
              Her partnerimizle doğrudan ilişki kurarak dünyanın en iyi kahve
              bölgelerinden hasat eden çiftçilere adil fiyat ödüyoruz.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {origins.map((o) => (
              <div
                key={o.country}
                className="p-4 text-center"
                style={{ border: "1px solid #E8E8E8", background: "#F5F5F5" }}
              >
                <div className="text-2xl mb-2">{o.flag}</div>
                <div
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#2C2B2B",
                    marginBottom: "0.2rem",
                  }}
                >
                  {o.country}
                </div>
                <div style={{ fontSize: "0.65rem", color: "#6B6868" }}>{o.region}</div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
