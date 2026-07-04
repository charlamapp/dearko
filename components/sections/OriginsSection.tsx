"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { origins } from "@/lib/data"

export default function OriginsSection() {
  return (
    <section className="section" style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8" }}>
      <div className="wrap">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Sol: metin */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
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

          {/* Sağ: atmosferik görsel */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          >
            <div className="aspect-[4/5] overflow-hidden" style={{ background: "#F5F5F5" }}>
              <motion.img
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=900&q=85"
                alt="Kahve çiftçisi"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>
            {/* Floating stat */}
            <motion.div
              className="absolute -bottom-4 -left-4 lg:-left-8 p-5"
              style={{ background: "#5CADD4", minWidth: "140px" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 900, fontSize: "2rem", color: "#fff", lineHeight: 1, marginBottom: "0.2rem" }}>12</p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>Ülkeden Origin</p>
            </motion.div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
