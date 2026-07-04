"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, RotateCcw, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart"

/* ─── Types ──────────────────────────────────────────────── */
type Option = {
  id: string
  label: string
  desc?: string
  icon: React.ReactNode
  scores: Partial<Record<CoffeeId, number>>
}
type Question = { id: string; title: string; subtitle: string; options: Option[] }
type CoffeeId = "ethiopia" | "colombia" | "guatemala" | "kenya"

/* ─── Coffee results ─────────────────────────────────────── */
const RESULTS: Record<CoffeeId, {
  id: string; name: string; origin: string; roast: string
  flavor: string[]; price: number; weight: string
  desc: string; image: string; badge: string
}> = {
  ethiopia: {
    id: "ethiopia-yirgacheffe",
    name: "Etiyopya Yirgacheffe",
    origin: "Etiyopya · Yirgacheffe",
    roast: "Açık Kavrum",
    flavor: ["Bergamot", "Şeftali", "Çiçeksi"],
    price: 320,
    weight: "250g",
    desc: "Yirgacheffe'nin yüksek rakımlarında yetişen bu kahve, parlak asitliği ve çiçeksi aromalarıyla specialty dünyasının en ikonik tatlarından birini sunar.",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=85",
    badge: "Meyvemsi & Çiçeksi",
  },
  colombia: {
    id: "colombia-huila",
    name: "Kolombiya Huila",
    origin: "Kolombiya · Huila",
    roast: "Orta Kavrum",
    flavor: ["Karamel", "Fındık", "Elma"],
    price: 290,
    weight: "250g",
    desc: "And Dağları'nın volkanik topraklarında küçük çiftçiler tarafından yetiştirilen bu kahve, dengeli yapısı ve tatlı bitimiyle her damağa hitap eder.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=85",
    badge: "Dengeli & Herkes için",
  },
  guatemala: {
    id: "guatemala-antigua",
    name: "Guatemala Antigua",
    origin: "Guatemala · Antigua",
    roast: "Orta-Koyu Kavrum",
    flavor: ["Bitter Çikolata", "Kahverengi Şeker", "Tam Gövde"],
    price: 275,
    weight: "250g",
    desc: "Volkanik toprak ve serin iklimin armağanı olan bu kahve, tam gövdesi ve çikolata notalarıyla espresso sevenlerin favorisi.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=85",
    badge: "Çikolatalı & Tam Gövde",
  },
  kenya: {
    id: "kenya-kiambu",
    name: "Kenya Kiambu",
    origin: "Kenya · Kiambu",
    roast: "Açık Kavrum",
    flavor: ["Kırmızı Üzüm", "Frenk Üzümü", "Parlak Asit"],
    price: 345,
    weight: "250g",
    desc: "Afrika'nın en cesur kahvelerinden biri. Şarap üzümü ve egzotik meyve notaları, parlak asidiyle specialty meraklılarına özel bir deneyim.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=85",
    badge: "Cesur & Egzotik",
  },
}

/* ─── SVG Icons ──────────────────────────────────────────── */
const icons = {
  filterMachine: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="22" y="14" width="36" height="8" rx="2"/>
      <path d="M28 22 L32 52 Q40 58 48 52 L52 22"/>
      <rect x="26" y="54" width="28" height="12" rx="2"/>
      <line x1="40" y1="54" x2="40" y2="66"/>
      <path d="M34 30 Q40 35 46 30"/>
    </svg>
  ),
  frenchPress: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="26" y="16" width="28" height="48" rx="3"/>
      <line x1="40" y1="10" x2="40" y2="16"/>
      <rect x="34" y="8" width="12" height="4" rx="1"/>
      <line x1="26" y1="55" x2="54" y2="55"/>
      <ellipse cx="40" cy="55" rx="10" ry="2"/>
      <line x1="30" y1="55" x2="50" y2="55"/>
      <path d="M26 30 Q18 33 18 40 Q18 47 26 47"/>
    </svg>
  ),
  pourOver: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 16 L40 52 L56 16 Z"/>
      <ellipse cx="40" cy="16" rx="16" ry="4"/>
      <rect x="26" y="54" width="28" height="10" rx="5"/>
      <line x1="40" y1="52" x2="40" y2="54"/>
      <path d="M32 28 L40 44 L48 28"/>
    </svg>
  ),
  espresso: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="16" y="12" width="48" height="44" rx="4"/>
      <rect x="22" y="18" width="20" height="16" rx="2"/>
      <circle cx="52" cy="26" r="7"/>
      <circle cx="52" cy="26" r="3"/>
      <line x1="32" y1="34" x2="32" y2="42"/>
      <line x1="28" y1="42" x2="52" y2="42"/>
      <ellipse cx="32" cy="46" rx="10" ry="3"/>
      <line x1="56" y1="56" x2="60" y2="64"/>
      <path d="M60 64 Q65 64 65 58"/>
    </svg>
  ),
  cezve: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 48 Q24 32 32 24 L48 24 Q56 32 52 48 Z"/>
      <line x1="28" y1="48" x2="52" y2="48"/>
      <ellipse cx="40" cy="48" rx="12" ry="4"/>
      <path d="M24 28 Q16 28 16 36 Q16 40 24 40"/>
      <line x1="40" y1="20" x2="40" y2="24"/>
      <path d="M36 18 Q40 14 44 18"/>
    </svg>
  ),
  questionMark: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="40" cy="40" r="26"/>
      <path d="M32 32 Q32 24 40 24 Q48 24 48 32 Q48 38 40 42"/>
      <circle cx="40" cy="52" r="2" fill="#5CADD4"/>
    </svg>
  ),
  blackCup: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 30 L28 60 Q28 64 40 64 Q52 64 52 60 L56 30 Z"/>
      <ellipse cx="40" cy="30" rx="16" ry="5"/>
      <path d="M52 38 Q62 38 62 46 Q62 54 52 54"/>
      <ellipse cx="40" cy="64" rx="12" ry="4"/>
    </svg>
  ),
  milkCup: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 30 L28 60 Q28 64 40 64 Q52 64 52 60 L56 30 Z"/>
      <ellipse cx="40" cy="30" rx="16" ry="5"/>
      <path d="M52 38 Q62 38 62 46 Q62 54 52 54"/>
      <path d="M30 30 Q35 22 40 30 Q45 22 50 30" strokeDasharray="3 2"/>
    </svg>
  ),
  latteCup: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 32 L26 62 Q26 66 40 66 Q54 66 54 62 L58 32 Z"/>
      <ellipse cx="40" cy="32" rx="18" ry="6"/>
      <path d="M24 32 Q28 24 32 32 Q36 24 40 32 Q44 24 48 32 Q52 24 56 32"/>
      <path d="M54 42 Q64 42 64 50 Q64 58 54 58"/>
    </svg>
  ),
  variesCup: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 44 L21 60 Q21 63 28 63 Q35 63 35 60 L38 44 Z"/>
      <ellipse cx="28" cy="44" rx="10" ry="3.5"/>
      <path d="M42 36 L45 56 Q45 60 54 60 Q63 60 63 56 L66 36 Z"/>
      <ellipse cx="54" cy="36" rx="12" ry="4"/>
    </svg>
  ),
  fruity: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="40" cy="46" r="18"/>
      <path d="M40 28 Q40 18 50 14"/>
      <path d="M40 28 Q44 20 54 20"/>
      <circle cx="34" cy="42" r="3"/>
      <circle cx="46" cy="42" r="3"/>
      <path d="M34 52 Q40 58 46 52"/>
    </svg>
  ),
  chocolate: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="16" y="24" width="48" height="36" rx="4"/>
      <line x1="16" y1="38" x2="64" y2="38"/>
      <line x1="16" y1="52" x2="64" y2="52"/>
      <line x1="32" y1="24" x2="32" y2="60"/>
      <line x1="48" y1="24" x2="48" y2="60"/>
    </svg>
  ),
  balanced: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="40" y1="14" x2="40" y2="64"/>
      <line x1="20" y1="24" x2="60" y2="24"/>
      <path d="M20 24 L14 40 Q14 46 20 46 Q26 46 26 40 Z"/>
      <path d="M60 24 L54 40 Q54 46 60 46 Q66 46 66 40 Z"/>
      <ellipse cx="40" cy="64" rx="10" ry="3"/>
    </svg>
  ),
  caramel: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 60 Q20 54 20 40 Q20 22 40 18 Q60 22 60 40 Q60 54 50 60"/>
      <path d="M30 60 Q40 68 50 60"/>
      <path d="M34 38 Q34 30 40 28 Q46 30 46 38 Q46 46 40 48 Q34 46 34 38Z"/>
      <path d="M40 28 Q40 20 44 16"/>
    </svg>
  ),
  lightRoast: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="40" cy="40" r="14"/>
      <line x1="40" y1="14" x2="40" y2="20"/>
      <line x1="40" y1="60" x2="40" y2="66"/>
      <line x1="14" y1="40" x2="20" y2="40"/>
      <line x1="60" y1="40" x2="66" y2="40"/>
      <line x1="22" y1="22" x2="26" y2="26"/>
      <line x1="54" y1="54" x2="58" y2="58"/>
      <line x1="58" y1="22" x2="54" y2="26"/>
      <line x1="26" y1="54" x2="22" y2="58"/>
    </svg>
  ),
  mediumRoast: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M40 14 Q56 26 56 40 Q56 54 40 66 Q24 54 24 40 Q24 26 40 14Z"/>
      <line x1="40" y1="22" x2="40" y2="28"/>
      <line x1="40" y1="52" x2="40" y2="58"/>
      <line x1="28" y1="40" x2="34" y2="40"/>
      <line x1="46" y1="40" x2="52" y2="40"/>
    </svg>
  ),
  darkRoast: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 20 Q18 32 18 44 Q18 58 32 64 Q20 54 24 42 Q30 28 44 26 Q36 24 28 20Z"/>
      <path d="M44 26 Q58 30 62 44 Q62 58 48 66 Q64 58 64 44 Q62 28 44 26Z"/>
      <path d="M24 42 Q28 36 32 40 Q34 46 30 50"/>
      <path d="M38 32 Q42 28 46 32 Q48 38 44 42"/>
    </svg>
  ),
  seedling: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="40" y1="64" x2="40" y2="36"/>
      <path d="M40 36 Q40 18 58 18 Q58 36 40 36Z"/>
      <path d="M40 48 Q40 36 24 32 Q22 44 40 48Z"/>
    </svg>
  ),
  halfStar: (
    <svg viewBox="0 0 80 80" fill="none" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="40,14 46,30 64,30 50,42 56,58 40,48 24,58 30,42 16,30 34,30"/>
      <path d="M40 14 L40 48" fill="#C8DFF0" stroke="none"/>
    </svg>
  ),
  fullStar: (
    <svg viewBox="0 0 80 80" fill="#C8DFF0" stroke="#5CADD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="40,14 46,30 64,30 50,42 56,58 40,48 24,58 30,42 16,30 34,30"/>
    </svg>
  ),
}

/* ─── Questions ──────────────────────────────────────────── */
const questions: Question[] = [
  {
    id: "brew",
    title: "Kahvenizi nasıl demliyorsunuz?",
    subtitle: "En sık kullandığınız yöntemi seçin.",
    options: [
      { id: "filter",    label: "Filtre Makine",    desc: "Otomatik damlatmalı", icon: icons.filterMachine,
        scores: { colombia: 2, guatemala: 1 } },
      { id: "french",    label: "French Press",     desc: "Piston / Pistonlu", icon: icons.frenchPress,
        scores: { guatemala: 2, colombia: 1 } },
      { id: "pourover",  label: "Pour Over",        desc: "Chemex / V60 / Dripper", icon: icons.pourOver,
        scores: { ethiopia: 2, kenya: 2 } },
      { id: "espresso",  label: "Espresso",         desc: "Makine / Moka Pot", icon: icons.espresso,
        scores: { guatemala: 3, colombia: 1 } },
      { id: "cezve",     label: "Türk Kahvesi",     desc: "Cezve ile pişirme", icon: icons.cezve,
        scores: { guatemala: 2, colombia: 1 } },
      { id: "dontknow",  label: "Henüz bilmiyorum", desc: "Yeni keşfediyorum", icon: icons.questionMark,
        scores: { colombia: 2 } },
    ],
  },
  {
    id: "style",
    title: "Kahvenizi nasıl içiyorsunuz?",
    subtitle: "En çok hangisi size uyuyor?",
    options: [
      { id: "black",  label: "Sade",              desc: "Süt ve şeker yok", icon: icons.blackCup,
        scores: { ethiopia: 2, kenya: 2 } },
      { id: "little", label: "Az Sütlü",           desc: "Küçük bir dokunuş", icon: icons.milkCup,
        scores: { colombia: 2, ethiopia: 1 } },
      { id: "latte",  label: "Sütlü / Köpüklü",   desc: "Latte, cappuccino…", icon: icons.latteCup,
        scores: { guatemala: 2, colombia: 1 } },
      { id: "varies", label: "Değişir",             desc: "Her türlü içerim", icon: icons.variesCup,
        scores: { colombia: 1, guatemala: 1 } },
    ],
  },
  {
    id: "flavor",
    title: "Hangi tatları seversiniz?",
    subtitle: "Fincanınızda ne hissetmek istersiniz?",
    options: [
      { id: "fruity",     label: "Meyvemsi & Çiçeksi",  desc: "Bergamot, şeftali, üzüm", icon: icons.fruity,
        scores: { ethiopia: 3, kenya: 2 } },
      { id: "chocolate",  label: "Çikolatalı & Fındıklı", desc: "Bitter çikolata, kavruk", icon: icons.chocolate,
        scores: { guatemala: 3, colombia: 1 } },
      { id: "balanced",   label: "Dengeli & Yumuşak",    desc: "Karamel, elma, temiz bitiş", icon: icons.balanced,
        scores: { colombia: 3 } },
      { id: "caramel",    label: "Karamel & Tatlımsı",   desc: "Hafif tatlı, kremsi", icon: icons.caramel,
        scores: { colombia: 2, guatemala: 1 } },
    ],
  },
  {
    id: "roast",
    title: "Kavrum tercihiniiz nedir?",
    subtitle: "Kahvenizin yoğunluğunu belirleyin.",
    options: [
      { id: "light",  label: "Açık Kavrum",   desc: "İnce, hafif, parlak asit", icon: icons.lightRoast,
        scores: { ethiopia: 3, kenya: 2 } },
      { id: "medium", label: "Orta Kavrum",   desc: "Dengeli, tatlımsı bitiş", icon: icons.mediumRoast,
        scores: { colombia: 3, guatemala: 1 } },
      { id: "dark",   label: "Koyu Kavrum",   desc: "Güçlü, tam gövde, bold", icon: icons.darkRoast,
        scores: { guatemala: 3, colombia: 1 } },
    ],
  },
  {
    id: "experience",
    title: "Specialty kahveyle ne kadar tanışıksınız?",
    subtitle: "Dürüstçe seçin — yanlış cevap yok.",
    options: [
      { id: "new",    label: "Yeni keşfediyorum",   desc: "Specialty dünyasına adım atıyorum", icon: icons.seedling,
        scores: { colombia: 2 } },
      { id: "some",   label: "Biraz deneyimliyim",  desc: "Favorilerim var ama merak ediyorum", icon: icons.halfStar,
        scores: { colombia: 1, ethiopia: 1, guatemala: 1 } },
      { id: "expert", label: "Specialty tutkunu",   desc: "Single origin, terroir, process…", icon: icons.fullStar,
        scores: { ethiopia: 2, kenya: 3 } },
    ],
  },
]

/* ─── Score calculator ───────────────────────────────────── */
function calcResult(answers: string[]): CoffeeId {
  const scores: Record<CoffeeId, number> = { ethiopia: 0, colombia: 0, guatemala: 0, kenya: 0 }
  answers.forEach((answerId, qi) => {
    const opt = questions[qi]?.options.find((o) => o.id === answerId)
    if (!opt) return
    for (const [key, val] of Object.entries(opt.scores)) {
      scores[key as CoffeeId] += val
    }
  })
  return (Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0]) as CoffeeId
}

/* ─── UI helpers ─────────────────────────────────────────── */
const slide = {
  enter:  { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit:   { opacity: 0, x: -60 },
}

/* ─── Main component ─────────────────────────────────────── */
export default function QuizPage() {
  const [step, setStep] = useState(0)              // 0..4 = questions, 5 = result
  const [answers, setAnswers] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const { addItem } = useCart()

  const q = questions[step]
  const result = step === 5 ? RESULTS[calcResult(answers)] : null
  const progress = Math.round((step / questions.length) * 100)

  function choose(id: string) { setSelected(id) }

  function next() {
    if (!selected) return
    const newAnswers = [...answers.slice(0, step), selected]
    setAnswers(newAnswers)
    setSelected(null)
    setStep(step + 1)
  }

  function restart() {
    setStep(0); setAnswers([]); setSelected(null)
  }

  function addToCart() {
    if (!result) return
    addItem({ id: result.id, name: result.name, price: result.price, image: result.image, quantity: 1 })
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", paddingTop: "6.25rem" }}>

      {/* Progress bar */}
      {step < questions.length && (
        <div style={{ position: "fixed", top: "6.25rem", left: 0, right: 0, height: 3, background: "#F0F0F0", zIndex: 40 }}>
          <motion.div
            style={{ height: "100%", background: "#5CADD4", transformOrigin: "left" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      )}

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>

        {/* Logo + step counter */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none" }}>
            <svg width="22" height="30" viewBox="0 0 28 38" fill="none">
              <path d="M14 0C8 0 3 5 3 12C3 16 4.5 19.5 7 22L4 34C4 36 6 38 8 38H20C22 38 24 36 24 34L21 22C23.5 19.5 25 16 25 12C25 5 20 0 14 0Z" fill="#5CADD4"/>
              <ellipse cx="14" cy="12" rx="6" ry="8" fill="#FFFFFF"/>
            </svg>
            <span style={{ fontSize: "0.5rem", fontWeight: 800, letterSpacing: "0.3em", color: "#2C2B2B" }}>DEARKO</span>
          </Link>
          {step < questions.length && (
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "#A0A0A0", letterSpacing: "0.05em" }}>
              {step + 1} / {questions.length}
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Question screens ── */}
          {step < questions.length && (
            <motion.div key={`q${step}`} variants={slide} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}>

              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5CADD4", marginBottom: "0.75rem" }}>
                  Kahve Profil Testi
                </p>
                <h1 style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 800, color: "#2C2B2B", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "0.6rem" }}>
                  {q.title}
                </h1>
                <p style={{ fontSize: "0.9rem", color: "#8A8A8A" }}>{q.subtitle}</p>
              </div>

              {/* Option cards */}
              <div style={{
                display: "grid",
                gridTemplateColumns: q.options.length <= 4 ? "repeat(auto-fit, minmax(160px, 1fr))" : "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "0.875rem",
                marginBottom: "2rem",
              }}>
                {q.options.map((opt) => {
                  const active = selected === opt.id
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => choose(opt.id)}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        padding: "1.5rem 1rem", border: "none", cursor: "pointer",
                        background: active ? "#EBF4FB" : "#fff",
                        outline: active ? "2px solid #5CADD4" : "2px solid #E8E8E8",
                        outlineOffset: -2,
                        transition: "all 0.2s ease",
                        position: "relative",
                      }}
                    >
                      {active && (
                        <div style={{
                          position: "absolute", top: 10, right: 10,
                          width: 20, height: 20, background: "#5CADD4",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}

                      {/* Icon */}
                      <div style={{ width: 72, height: 72, marginBottom: "0.75rem" }}>
                        {opt.icon}
                      </div>

                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.825rem", fontWeight: 700, color: "#2C2B2B", marginBottom: "0.2rem", textAlign: "center" }}>
                        {opt.label}
                      </p>
                      {opt.desc && (
                        <p style={{ fontSize: "0.7rem", color: "#A0A0A0", textAlign: "center", lineHeight: 1.4 }}>
                          {opt.desc}
                        </p>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Next button */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <motion.button
                  onClick={next}
                  disabled={!selected}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.9rem 2.5rem", border: "none", cursor: selected ? "pointer" : "not-allowed",
                    background: selected ? "#5CADD4" : "#E0E0E0",
                    fontFamily: "var(--font-inter)", fontSize: "0.8rem", fontWeight: 700,
                    letterSpacing: "0.06em", textTransform: "uppercase", color: selected ? "#fff" : "#A0A0A0",
                    transition: "all 0.2s ease",
                  }}
                  whileHover={selected ? { scale: 1.02 } : {}}
                  whileTap={selected ? { scale: 0.98 } : {}}
                >
                  {step === questions.length - 1 ? "Kahvemi Bul" : "Devam"}
                  <ArrowRight size={15} />
                </motion.button>
              </div>

            </motion.div>
          )}

          {/* ── Result screen ── */}
          {step === questions.length && result && (
            <motion.div key="result" variants={slide} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, background: "#EBF4FB", marginBottom: "1.25rem" }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 2L17.5 10H26L19.5 15L22 23L14 18L6 23L8.5 15L2 10H10.5Z" fill="#5CADD4"/>
                  </svg>
                </motion.div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5CADD4", marginBottom: "0.6rem" }}>
                  Profiliniz Hazır
                </p>
                <h1 style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, color: "#2C2B2B", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
                  Sizin kahvenizi bulduk.
                </h1>
              </div>

              {/* Product card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  background: "#fff", border: "1px solid #E8E8E8",
                  overflow: "hidden", maxWidth: 640, margin: "0 auto 2rem",
                }}
                className="grid-cols-1 sm:grid-cols-2"
              >
                {/* Image */}
                <div style={{ position: "relative", minHeight: 260 }}>
                  <img src={result.image} alt={result.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{
                    position: "absolute", bottom: 12, left: 12,
                    background: "#5CADD4", padding: "0.3rem 0.75rem",
                    fontFamily: "var(--font-inter)", fontSize: "0.62rem", fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff",
                  }}>
                    {result.badge}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "2rem 1.75rem", display: "flex", flexDirection: "column" }}>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5CADD4", marginBottom: "0.5rem" }}>
                    {result.origin}
                  </p>
                  <h2 style={{ fontFamily: "var(--font-inter)", fontSize: "1.25rem", fontWeight: 800, color: "#2C2B2B", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "0.6rem" }}>
                    {result.name}
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "#6B6868", lineHeight: 1.65, marginBottom: "1rem", flex: 1 }}>
                    {result.desc}
                  </p>

                  {/* Flavors */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
                    {result.flavor.map((f) => (
                      <span key={f} style={{ border: "1px solid #E8E8E8", padding: "0.2rem 0.6rem", fontSize: "0.68rem", fontWeight: 500, color: "#6B6868", fontFamily: "var(--font-inter)" }}>
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Roast */}
                  <p style={{ fontSize: "0.72rem", color: "#A0A0A0", marginBottom: "1.25rem" }}>
                    {result.roast} · {result.weight}
                  </p>

                  {/* Price + CTA */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontWeight: 800, fontSize: "1.35rem", color: "#2C2B2B" }}>
                      ₺{result.price}
                    </span>
                    <button
                      onClick={addToCart}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.7rem 1.2rem", background: "#5CADD4", border: "none", cursor: "pointer",
                        fontFamily: "var(--font-inter)", fontSize: "0.72rem", fontWeight: 700,
                        letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff",
                      }}
                    >
                      <ShoppingCart size={13} /> Sepete Ekle
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center", marginBottom: "2rem" }}
              >
                <Link href={`/urun/${result.id}`} className="btn-dark">
                  Ürünü İncele →
                </Link>
                <Link href="/magazin" className="btn-outline">
                  Tüm Kahveleri Gör
                </Link>
                <button onClick={restart}
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-inter)", fontSize: "0.78rem", fontWeight: 600, color: "#A0A0A0", padding: "0.75rem 1rem" }}>
                  <RotateCcw size={13} /> Testi Tekrarla
                </button>
              </motion.div>

              {/* Profile breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{ background: "#F8F8F8", border: "1px solid #E8E8E8", padding: "1.5rem", maxWidth: 640, margin: "0 auto" }}
              >
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A0A0A0", marginBottom: "1rem" }}>
                  Kahve Profiliniz
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.75rem" }}>
                  {[
                    { label: "Demim", value: questions[0].options.find(o => o.id === answers[0])?.label ?? "" },
                    { label: "İçim", value: questions[1].options.find(o => o.id === answers[1])?.label ?? "" },
                    { label: "Tat", value: questions[2].options.find(o => o.id === answers[2])?.label ?? "" },
                    { label: "Kavrum", value: questions[3].options.find(o => o.id === answers[3])?.label ?? "" },
                    { label: "Deneyim", value: questions[4].options.find(o => o.id === answers[4])?.label ?? "" },
                  ].map((item) => (
                    <div key={item.label} style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A0A0A0", marginBottom: "0.25rem" }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2C2B2B", fontFamily: "var(--font-inter)" }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
