"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { origins } from "@/lib/data"

const WorldMap = dynamic(() => import("@/components/ui/WorldMap"), { ssr: false })

export default function OriginsSection() {
  return (
    <section className="section" style={{ background: "#F7F5F1", borderBottom: "1px solid #EAE7E1" }}>
      <div className="wrap">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Sol: metin */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <p className="label mb-5">Direkt Ticaret</p>
            <h2 className="heading-lg mb-7">12 Ülke,<br />Tek Fincan.</h2>
            <p className="body-xl mb-8">
              Her partnerimizle doğrudan ilişki kurarak dünyanın en iyi kahve bölgelerinden
              hasat eden çiftçilere adil fiyat ödüyoruz. Çekirdek bizim elimize geçtiğinde
              nerede, kim tarafından ve nasıl yetiştirildiğini biliyoruz.
            </p>
            <motion.div
              className="flex flex-wrap gap-2 mb-10"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            >
              {origins.map((o) => (
                <motion.span
                  key={o.country}
                  variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { duration: 0.3 } } }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", border: "1px solid #E8E8E8", padding: "0.35rem 0.75rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 500, color: "#6B6868" }}>
                  <span style={{ fontSize: "1rem" }}>{o.flag}</span> {o.country}
                </motion.span>
              ))}
            </motion.div>
            <Link href="/hakkimizda" className="btn-outline">Hikayemiz</Link>
          </motion.div>

          {/* Sağ: dünya haritası */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.1 }}
          >
            <WorldMap />
          </motion.div>

        </div>

      </div>
    </section>
  )
}
