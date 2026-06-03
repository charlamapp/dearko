import Link from "next/link"
import { Check } from "lucide-react"
import { subscriptionPlans } from "@/lib/data"

export default function SubscriptionBanner() {
  return (
    <section className="section" style={{ background: "#F5F5F5", borderBottom: "1px solid #E8E8E8" }}>
      <div className="wrap">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-14">
          <div>
            <p className="label mb-3">Abonelik</p>
            <h2 className="heading-lg">Taze Kahve,<br />Her Zaman.</h2>
          </div>
          <p className="body-lg lg:max-w-sm">
            Siparişten sonra kavrulur, 48 saat içinde kapınızda. İstediğiniz zaman iptal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className="p-7 flex flex-col relative"
              style={{
                border: plan.popular ? "2px solid #5CADD4" : "1px solid #E8E8E8",
                background: plan.popular ? "#EBF4FB" : "#FFFFFF",
              }}
            >
              {plan.popular && (
                <span
                  className="absolute -top-3 left-6 px-3 py-1 text-white"
                  style={{
                    background: "#5CADD4",
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
              <div className="mb-4">
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
              <div className="mb-6 pb-6" style={{ borderBottom: "1px solid #E8E8E8" }}>
                <span
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 800, fontSize: "2.5rem", color: "#2C2B2B", lineHeight: 1, display: "block" }}
                >
                  ₺{plan.price}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#6B6868" }}>/ {plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-[0.8125rem]" style={{ color: "#6B6868" }}>
                    <Check size={12} className="flex-shrink-0 mt-0.5" style={{ color: "#5CADD4" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/abonelik"
                className={plan.popular ? "btn-dark" : "btn-outline"}
                style={plan.popular ? { background: "#5CADD4" } : {}}
              >
                Bu Planı Seç
              </Link>
            </div>
          ))}
        </div>

        <p style={{ fontSize: "0.75rem", color: "#6B6868", textAlign: "center" }}>
          İstediğiniz zaman iptal edebilirsiniz.
        </p>

      </div>
    </section>
  )
}
