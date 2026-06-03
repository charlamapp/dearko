export type CoffeeProduct = {
  id: string
  name: string
  category: 'coffee'
  origin: string
  region: string
  process: string
  roast: string
  flavor: string[]
  price: number
  weight: string
  image: string
  description: string
}

export type EquipmentProduct = {
  id: string
  name: string
  category: 'equipment'
  brand: string
  price: number
  weight?: string
  image: string
  description: string
}

export type Product = CoffeeProduct | EquipmentProduct

export const coffeeProducts: CoffeeProduct[] = [
  {
    id: "ethiopia-yirgacheffe",
    name: "Etiyopya Yirgacheffe",
    category: "coffee",
    origin: "Etiyopya",
    region: "Yirgacheffe",
    process: "Yıkama",
    roast: "Açık Kavrum",
    flavor: ["Bergamot", "Şeftali", "Çiçeksi"],
    price: 320,
    weight: "250g",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=85",
    description: "Yirgacheffe'nin yüksek rakımlarında yetişen bu kahve, parlak asitliği ve çiçeksi aromalarıyla specialty dünyasının en ikonik tatlarından birini sunar.",
  },
  {
    id: "colombia-huila",
    name: "Kolombiya Huila",
    category: "coffee",
    origin: "Kolombiya",
    region: "Huila",
    process: "Yıkama",
    roast: "Orta Kavrum",
    flavor: ["Karamel", "Fındık", "Elma"],
    price: 290,
    weight: "250g",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=85",
    description: "And Dağları'nın volkanik topraklarında küçük çiftçiler tarafından yetiştirilen bu kahve, dengeli yapısı ve tatlı bitimiyle her damağa hitap eder.",
  },
  {
    id: "guatemala-antigua",
    name: "Guatemala Antigua",
    category: "coffee",
    origin: "Guatemala",
    region: "Antigua",
    process: "Doğal",
    roast: "Orta-Koyu",
    flavor: ["Bitter Çikolata", "Kahverengi Şeker", "Tam Gövde"],
    price: 275,
    weight: "250g",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=85",
    description: "Volkanik toprak ve serin iklimin armağanı olan bu kahve, tam gövdesi ve çikolata notalarıyla espresso sevenlerin favorisi.",
  },
  {
    id: "kenya-kiambu",
    name: "Kenya Kiambu",
    category: "coffee",
    origin: "Kenya",
    region: "Kiambu",
    process: "Yıkama",
    roast: "Açık Kavrum",
    flavor: ["Kırmızı Üzüm", "Siyah Frenk Üzümü", "Parlak Asit"],
    price: 345,
    weight: "250g",
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=85",
    description: "Kenya'nın SL-28 ve SL-34 çeşitlerinden oluşan bu seçki, karakteristik kırmızı meyve asitliği ve şarap benzeri karmaşıklığıyla benzersiz bir deneyim sunar.",
  },
  {
    id: "brazil-cerrado",
    name: "Brezilya Cerrado",
    category: "coffee",
    origin: "Brezilya",
    region: "Cerrado",
    process: "Doğal",
    roast: "Orta Kavrum",
    flavor: ["Fındık", "Fıstık Ezmesi", "Tatlı Kakao"],
    price: 245,
    weight: "250g",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=85",
    description: "Klasik Brezilya karakteri: fındıksı, tatlı ve yumuşak asitliğiyle mükemmel bir günlük içecek. Filter veya French Press için ideal.",
  },
  {
    id: "costa-rica-tarrazu",
    name: "Kosta Rika Tarrazu",
    category: "coffee",
    origin: "Kosta Rika",
    region: "Tarrazu",
    process: "Bal",
    roast: "Açık-Orta",
    flavor: ["Bal", "Şeftali", "Mandalina"],
    price: 310,
    weight: "250g",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=85",
    description: "Bal işleme yöntemiyle hazırlanan bu kahve, meyvemsi tatlılık ve hafif asitliğin mükemmel dengesini yakalar.",
  },
]

export const equipmentProducts: EquipmentProduct[] = [
  {
    id: "hario-v60",
    name: "Hario V60 Seramik",
    category: "equipment",
    brand: "Hario",
    price: 420,
    image: "https://images.unsplash.com/photo-1598908314732-07113901949e?w=800&q=85",
    description: "Japon el yapımı seramik dripper. Spiral yivleri ve geniş deliğiyle akış hızını tam kontrol altında tutar.",
  },
  {
    id: "chemex-6-cup",
    name: "Chemex 6 Fincan",
    category: "equipment",
    brand: "Chemex",
    price: 680,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=85",
    description: "1941'den bu yana değişmeyen ikonik tasarım. Temiz ve berrak bir fincan için tercih.",
  },
  {
    id: "comandante-c40",
    name: "Comandante C40",
    category: "equipment",
    brand: "Comandante",
    price: 3200,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=85",
    description: "El değirmenlerinin Rolls-Royce'u. Nitro Blade çelik bıçakları ile mükemmel tutarlı öğütme.",
  },
  {
    id: "fellow-stagg-kettle",
    name: "Fellow Stagg EKG",
    category: "equipment",
    brand: "Fellow",
    price: 2400,
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=85",
    description: "0.1°C hassasiyetinde sıcaklık kontrolü. İnce gaga ve PID kontrolör ile pour-over için tasarlandı.",
  },
]

export const allProducts: Product[] = [...coffeeProducts, ...equipmentProducts]

export const subscriptionPlans = [
  {
    id: "starter",
    name: "Starter",
    beans: "250g",
    frequency: "2 haftada bir",
    price: 270,
    period: "teslimat",
    popular: false,
    features: [
      "250g taze kavrum çekirdek",
      "Sipariş sonrası kavrum",
      "Ücretsiz kargo",
      "İstediğinizde iptal",
    ],
  },
  {
    id: "explorer",
    name: "Explorer",
    beans: "500g",
    frequency: "2 haftada bir",
    price: 490,
    period: "teslimat",
    popular: true,
    features: [
      "500g taze kavrum çekirdek",
      "Sipariş sonrası kavrum",
      "Ücretsiz kargo",
      "Origin notu ve tadım kartı",
      "İstediğinizde iptal",
    ],
  },
  {
    id: "aficionado",
    name: "Aficionado",
    beans: "1kg",
    frequency: "2 haftada bir",
    price: 870,
    period: "teslimat",
    popular: false,
    features: [
      "1kg taze kavrum çekirdek",
      "Sipariş sonrası kavrum",
      "Ücretsiz kargo",
      "Origin notu ve tadım kartı",
      "%10 mağaza indirimi",
      "Öncelikli müşteri desteği",
    ],
  },
]

export const corporatePlans = [
  {
    id: "office-s",
    name: "Office S",
    capacity: "5–15 kişilik ofis",
    price: 1490,
    period: "ay",
    custom: false,
    features: [
      "1kg / hafta taze kavrum",
      "Ücretsiz kargo",
      "E-fatura",
      "Ekipman danışmanlığı",
    ],
  },
  {
    id: "office-m",
    name: "Office M",
    capacity: "15–50 kişilik ofis",
    price: 3200,
    period: "ay",
    custom: false,
    features: [
      "3kg / hafta taze kavrum",
      "Ücretsiz kargo",
      "E-fatura",
      "Ekipman danışmanlığı",
      "Barista eğitimi (yıllık)",
    ],
  },
  {
    id: "office-xl",
    name: "Office XL",
    capacity: "50+ kişilik ofis",
    price: null,
    period: "ay",
    custom: true,
    features: [
      "Özel miktar ve sıklık",
      "Özel etiket seçeneği",
      "Ekipman bakım desteği",
      "Düzenli barista eğitimleri",
      "Kurumsal hesap yöneticisi",
    ],
  },
]

export const vehicleServices = [
  { id: "espresso-bar", name: "Espresso Bar", icon: "☕", desc: "Çift gruplu La Marzocca ile espresso tabanlı tüm içecekler." },
  { id: "filter-station", name: "Filter İstasyonu", icon: "🌿", desc: "V60, Chemex ve Aeropress ile farklı kökenlerden filter kahve." },
  { id: "cold-brew", name: "Cold Brew Standı", icon: "🧊", desc: "18 saat demlenmiş cold brew ve nitro cold brew." },
  { id: "full-menu", name: "Tam Menü", icon: "✨", desc: "Espresso + filter + cold brew. Tüm ekipman ve barista dahil." },
]

export const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00",
]

export const origins = [
  { country: "Etiyopya", region: "Yirgacheffe", flag: "🇪🇹" },
  { country: "Kolombiya", region: "Huila", flag: "🇨🇴" },
  { country: "Guatemala", region: "Antigua", flag: "🇬🇹" },
  { country: "Kenya", region: "Kiambu", flag: "🇰🇪" },
  { country: "Brezilya", region: "Cerrado", flag: "🇧🇷" },
  { country: "Kosta Rika", region: "Tarrazu", flag: "🇨🇷" },
]
