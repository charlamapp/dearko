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
}

export default function FallingBeans() {
  const [beans, setBeans] = useState<Bean[]>([])
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("beans_shown")) return

    const generated: Bean[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: 2 + Math.random() * 96,
      size: 36 + Math.random() * 28,
      delay: Math.random() * 1.8,
      duration: 2.4 + Math.random() * 1.8,
      rotateStart: Math.random() * 360,
      rotateEnd: (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 300),
      driftX: (Math.random() - 0.5) * 100,
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/coffe-bean.png"
            alt=""
            width={bean.size}
            height={bean.size}
            style={{ display: "block", objectFit: "contain" }}
          />
        </motion.div>
      ))}
    </div>
  )
}
