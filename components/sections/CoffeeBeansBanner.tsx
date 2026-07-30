"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function CoffeeBeansBanner() {
  return (
    <section style={{ background: "#FFFFFF", overflow: "hidden" }}>

      {/* Görsel */}
      <div className="relative w-full" style={{ maxHeight: 420 }}>
        <motion.img
          src="https://images.unsplash.com/photo-1573884054824-95ec03df17da?w=1600&q=90"
          alt="Specialty kahve çekirdekleri"
          className="w-full object-cover"
          style={{ objectPosition: "center center", display: "block" }}
          initial={{ scale: 1.04 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      {/* İçerik */}
      <div className="wrap py-16 lg:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.72, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="label mb-5" style={{ color: "#6C8145" }}>Çekirdek Kalitesi</p>

          <h2 className="heading-lg mb-6 mx-auto" style={{ maxWidth: 640 }}>
            Her Fincanda Hissedilen<br />
            <span style={{ color: "#6C8145" }}>Çekirdek Farkı.</span>
          </h2>

          <p className="body-xl mx-auto mb-10" style={{ maxWidth: 560, color: "#5E5C5C" }}>
            Dünyanın en iyi kahve bölgelerinden, hasat zamanında toplanan yeşil çekirdekleri
            sipariş sonrası kavuruyoruz. Taze, canlı, tam istediğiniz gibi.
          </p>

          <Link href="/magazin" className="btn-dark inline-flex items-center gap-2">
            Tüm Kahveleri Keşfet
          </Link>
        </motion.div>
      </div>

    </section>
  )
}
