"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type Bean = {
  id: number
  left: number
  size: number
  delay: number
  duration: number
  rotateStart: number
  rotateEnd: number
  driftX: number
  bgPosX: number
  bgPosY: number
}

function RealBean({ size, bgPosX, bgPosY }: { size: number; bgPosX: number; bgPosY: number }) {
  return (
    <div
      style={{
        width: size,
        height: Math.round(size * 1.4),
        borderRadius: "50% 48% 52% 50% / 58% 55% 45% 42%",
        backgroundImage: "url('/coffee-beans.jpg')",
        backgroundSize: `${size * 14}px auto`,
        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
        boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
        flexShrink: 0,
      }}
    />
  )
}

export default function FallingBeans() {
  const [beans, setBeans] = useState<Bean[]>([])
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("beans_shown")) return

    const generated: Bean[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: 2 + Math.random() * 96,
      size: 28 + Math.random() * 24,
      delay: Math.random() * 1.8,
      duration: 2.4 + Math.random() * 1.8,
      rotateStart: Math.random() * 360,
      rotateEnd: (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 300),
      driftX: (Math.random() - 0.5) * 100,
      bgPosX: 5 + Math.random() * 90,
      // Sadece çekirdeklerin yoğun olduğu üst/alt kısımları göster
      bgPosY: Math.random() > 0.5 ? Math.random() * 28 : 72 + Math.random() * 28,
    }))

    setBeans(generated)

    const t = setTimeout(() => {
      setActive(true)
      sessionStorage.setItem("beans_shown", "1")
      setTimeout(() => setBeans([]), 6500)
    }, 2000)

    return () => clearTimeout(t)
  }, [])

  if (!active || beans.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9998 }}>
      {beans.map((bean) => (
        <motion.div
          key={bean.id}
          style={{ position: "absolute", left: `${bean.left}%`, top: 0 }}
          initial={{ y: -90, rotate: bean.rotateStart, x: 0, opacity: 1 }}
          animate={{
            y: 1200,
            rotate: bean.rotateStart + bean.rotateEnd,
            x: bean.driftX,
            opacity: [1, 1, 1, 0],
          }}
          transition={{
            duration: bean.duration,
            delay: bean.delay,
            ease: [0.2, 0.55, 0.85, 1],
            opacity: { times: [0, 0.55, 0.82, 1], duration: bean.duration, delay: bean.delay },
          }}
        >
          <RealBean size={bean.size} bgPosX={bean.bgPosX} bgPosY={bean.bgPosY} />
        </motion.div>
      ))}
    </div>
  )
}
