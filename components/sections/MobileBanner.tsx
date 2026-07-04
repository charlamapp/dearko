"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function MobileBanner() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "55vh", display: "flex", alignItems: "flex-end", borderBottom: "1px solid #E8E8E8" }}
    >
      <motion.img
        src="https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?w=1600&q=85"
        alt="Mobil Kahve Aracı"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="relative wrap w-full py-14 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p
            className="mb-4"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Mobil Kahve Aracı
          </p>
          <h2 className="heading-xl text-white max-w-lg mb-7" style={{ color: "#fff" }}>
            Kahveyi siz değil,<br />biz getiririz.
          </h2>
          <div className="flex gap-4 flex-wrap">
            <Link href="/mobil-arac" className="btn-dark">Detaylı Bilgi</Link>
            <Link href="/rezervasyon" className="btn-white">Rezervasyon Yap</Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
