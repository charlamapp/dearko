import Link from "next/link"

export default function CorporateBanner() {
  return (
    <section className="section" style={{ background: "#F5F5F5", borderBottom: "1px solid #E8E8E8" }}>
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <div>
            <p className="label mb-4">Kurumsal</p>
            <h2 className="heading-lg mb-6">Ofisinizde<br />Specialty Kahve.</h2>
            <p className="body-lg mb-10 max-w-md">
              Ofis büyüklüğünüze özel abonelik planları, ekipman desteği ve
              barista eğitimleriyle kahve kültürünü çalışma alanına taşıyın.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/kurumsal" className="btn-dark">Kurumsal Planlar</Link>
              <Link href="/iletisim" className="btn-outline">Teklif İste</Link>
            </div>
          </div>

          <div className="aspect-[4/3] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1497935586047-9395ee010a64?w=900&q=85"
              alt="Kurumsal kahve"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  )
}
