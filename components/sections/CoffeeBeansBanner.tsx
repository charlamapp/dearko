"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function CoffeeBeansBanner() {
  return (
    <section style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <div className="relative w-full">

        {/* Görsel */}
        <motion.img
          src="/coffee-beans.jpg"
          alt="Specialty kahve çekirdekleri"
          className="w-full"
          style={{ display: "block", objectFit: "cover" }}
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Metin — görselin ortasındaki beyaz alana overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-center px-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        >
          <div>
            <p className="label mb-4" style={{ color: "#6C8145" }}>Çekirdek Kalitesi</p>

            <h2 className="heading-lg mb-5">
              Her Fincanda Hissedilen<br />
              <span style={{ color: "#6C8145" }}>Çekirdek Farkı.</span>
            </h2>

            <p className="body-xl mb-8 mx-auto" style={{ maxWidth: 500, color: "#3A3838" }}>
              Dünyanın en iyi kahve bölgelerinden, hasat zamanında toplanan
              yeşil çekirdekleri sipariş sonrası kavuruyoruz.
              Taze, canlı, tam istediğiniz gibi.
            </p>

            <Link href="/magazin" className="btn-dark inline-flex items-center gap-2">
              Tüm Kahveleri Keşfet
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
