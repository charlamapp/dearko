"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function CoffeeBeansBanner() {
  return (
    <section style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <div className="flex flex-col lg:flex-row min-h-[480px] lg:min-h-[520px]">

        {/* Sol: Kahve çekirdeği görseli */}
        <motion.div
          className="w-full lg:w-1/2 overflow-hidden"
          style={{ minHeight: 280 }}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <img
            src="/coffee-beans.jpg"
            alt="Specialty kahve çekirdekleri"
            className="w-full h-full object-cover"
            style={{ display: "block", minHeight: 280 }}
          />
        </motion.div>

        {/* Sağ: Beyaz alan — metin */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 lg:px-16 xl:px-24"
          style={{ background: "#FFFFFF" }}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
        >
          <div className="max-w-md w-full">
            <p className="label mb-5" style={{ color: "#6C8145" }}>Çekirdek Kalitesi</p>

            <h2 className="heading-lg mb-6">
              Her Fincanda Hissedilen<br />
              <span style={{ color: "#6C8145" }}>Çekirdek Farkı.</span>
            </h2>

            <p className="body-xl mb-10" style={{ color: "#5E5C5C" }}>
              Dünyanın en iyi kahve bölgelerinden, hasat zamanında toplanan
              yeşil çekirdekleri sipariş sonrası kavuruyoruz. Taze, canlı,
              tam istediğiniz gibi.
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
