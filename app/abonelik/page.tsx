import Link from "next/link"
import { Check } from "lucide-react"
import { subscriptionPlans, corporatePlans } from "@/lib/data"

export const metadata = { title: "Abonelik" }

export default function AbonelikPage() {
  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "6.25rem" }}>

      {/* Hero */}
      <section className="pt-14 pb-16" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <p className="label mb-4">Abonelik</p>
          <h1 className="heading-xl max-w-2xl mb-5">Taze Kahve,<br />Her Zaman.</h1>
          <p className="body-lg max-w-lg">
            Siparişten sonra kavrulur, 48 saat içinde kapınızda. İstediğiniz zaman iptal.
          </p>
        </div>
      </section>

      {/* Individual plans */}
      <section className="section" style={{ background: "#FFFFFF" }}>
        <div className="wrap">
          <p className="label-ink mb-14">Bireysel Planlar</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col p-8 lg:p-10 relative"
                style={{
                  border: plan.popular ? "2px solid #6C8145" : "1px solid #E8E8E8",
                  background: plan.popular ? "#EBF4FB" : "#FFFFFF",
                }}
              >
                {plan.popular && (
                  <span
                    className="absolute -top-3 left-8 px-3 py-1 text-white"
                    style={{
                      background: "#6C8145",
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    En Popüler
                  </span>
                )}
                <div className="mb-6">
                  <h3
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#2C2B2B",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "#6B6868" }}>{plan.beans} · {plan.frequency}</p>
                </div>
                <div className="mb-8 pb-8" style={{ borderBottom: "1px solid #E8E8E8" }}>
                  <span
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 800, fontSize: "2.75rem", color: "#2C2B2B", lineHeight: 1, display: "block" }}
                  >
                    ₺{plan.price}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#6B6868" }}>/ {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-10 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[0.8125rem]" style={{ color: "#6B6868" }}>
                      <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#6C8145" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="btn-dark w-full"
                  style={plan.popular ? { background: "#6C8145" } : {}}
                >
                  Bu Planı Seç
                </button>
                <p className="text-center mt-3" style={{ fontSize: "0.7rem", color: "#6B6868" }}>
                  İstediğinizde iptal
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: "#F5F5F5", borderTop: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <p className="label-ink mb-12">Nasıl Çalışır?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              ["01", "Plan Seçin", "Kahve miktarı ve teslimat sıklığını belirleyin."],
              ["02", "Kavrulur", "Her teslimat öncesi siparişiniz özel olarak kavrulur."],
              ["03", "Kapınıza Gelir", "Kavrum tarihinden 48 saat içinde teslim edilir."],
            ].map(([num, title, desc]) => (
              <div key={num}>
                <p className="label mb-4">{num}</p>
                <h3
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#2C2B2B",
                    marginBottom: "0.75rem",
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#6B6868" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate plans */}
      <section className="section" style={{ background: "#FFFFFF", borderTop: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <p className="label-ink mb-4">Kurumsal</p>
          <h2 className="heading-lg mb-14">Ofisiniz İçin</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {corporatePlans.map((plan) => (
              <div
                key={plan.id}
                className="p-8 lg:p-10 flex flex-col"
                style={{ border: "1px solid #E8E8E8" }}
              >
                <div className="mb-6">
                  <h3
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#2C2B2B",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "#6B6868" }}>{plan.capacity}</p>
                </div>
                <div className="mb-6 pb-6" style={{ borderBottom: "1px solid #E8E8E8" }}>
                  {plan.custom ? (
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6C8145" }}>
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
                      <Check size={12} className="flex-shrink-0 mt-0.5" style={{ color: "#6C8145" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/iletisim" className="btn-outline justify-center text-center">
                  {plan.custom ? "Teklif İste" : "Başla"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: "#F5F5F5", borderTop: "1px solid #E8E8E8" }}>
        <div className="wrap-narrow">
          <p className="label-ink mb-12">Sık Sorulan Sorular</p>
          <div>
            {[
              ["Aboneliğimi ne zaman iptal edebilirim?", "İstediğiniz zaman, ceza olmadan. Bir sonraki teslimatten 3 iş günü önce iptal etmeniz yeterli."],
              ["Çekirdek tercihimi değiştirebilir miyim?", "Evet. Hesabınızdan origin, öğütme derecesi ve sıklık tercihlerini güncelleyebilirsiniz."],
              ["Kahveler gerçekten taze mi?", "Sipariş sonrası kavrulur. Kavrum tarihinden 48 saat içinde kargoya verilir."],
              ["Kurumsal fatura kesilebiliyor mu?", "Evet. Kurumsal müşterilere e-fatura düzenliyoruz."],
            ].map(([q, a]) => (
              <details key={q} className="group py-5" style={{ borderBottom: "1px solid #E8E8E8" }}>
                <summary className="flex justify-between items-center cursor-pointer list-none gap-6">
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2C2B2B" }}>
                    {q}
                  </span>
                  <span className="text-xl flex-shrink-0 transition-transform group-open:rotate-45" style={{ color: "#6B6868" }}>+</span>
                </summary>
                <p className="mt-4 max-w-2xl" style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#6B6868" }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
