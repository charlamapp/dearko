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

function BeanSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.4)} viewBox="0 0 24 34" fill="none">
      <ellipse cx="12" cy="17" rx="11" ry="15.5" fill="#4A2008" />
      <ellipse cx="12" cy="17" rx="9" ry="13" fill="#7B3F1A" />
      <ellipse cx="12" cy="17" rx="7.5" ry="11.5" fill="#8B4A20" />
      <path d="M12 4 Q7.5 17 12 30" stroke="#3B1A08" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
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
      size: 22 + Math.random() * 26,
      delay: Math.random() * 1.8,
      duration: 2.2 + Math.random() * 1.6,
      rotateStart: Math.random() * 360,
      rotateEnd: (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 300),
      driftX: (Math.random() - 0.5) * 100,
    }))

    setBeans(generated)

    const t = setTimeout(() => {
      setActive(true)
      sessionStorage.setItem("beans_shown", "1")
      setTimeout(() => setBeans([]), 6000)
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
            ease: [0.2, 0.6, 0.8, 1],
            opacity: { times: [0, 0.55, 0.82, 1], duration: bean.duration, delay: bean.delay },
          }}
        >
          <BeanSVG size={bean.size} />
        </motion.div>
      ))}
    </div>
  )
}
