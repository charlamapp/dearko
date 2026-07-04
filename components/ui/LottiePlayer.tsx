"use client"

import { useEffect, useRef } from "react"
import type { LottieRefCurrentProps } from "lottie-react"
import Lottie from "lottie-react"

type Props = {
  animationData: object
  loop?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function LottiePlayer({ animationData, loop = true, className, style }: Props) {
  const ref = useRef<LottieRefCurrentProps>(null)

  useEffect(() => {
    ref.current?.play()
  }, [])

  return (
    <Lottie
      lottieRef={ref}
      animationData={animationData}
      loop={loop}
      className={className}
      style={style}
    />
  )
}
