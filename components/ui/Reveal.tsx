"use client"

import { motion } from "framer-motion"

export default function Reveal({
  children,
  delay = 0,
  distance = 48,
}: {
  children: React.ReactNode
  delay?: number
  distance?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.72, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
