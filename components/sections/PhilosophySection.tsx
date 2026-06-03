export default function PhilosophySection() {
  const stats = [
    { value: "5.000+", label: "Aktif Abone" },
    { value: "12",     label: "Ülkeden Origin" },
    { value: "500+",   label: "Etkinlik" },
    { value: "48sa",   label: "İçinde Kargo" },
  ]

  return (
    <section className="section" style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8" }}>
      <div className="wrap">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center mb-20">
          <div>
            <p className="label mb-4">Felsefemiz</p>
            <h2 className="heading-lg">Her fincan<br />bir hikaye anlatır.</h2>
          </div>
          <p className="body-lg">
            2019'dan bu yana çiftçilerle doğrudan ortaklık kurarak adil fiyatlar ödüyoruz.
            Specialty kahvede şeffaflık, kalite ve sürdürülebilirlik üzerine kurulu bir
            anlayışla her hasat, titizlikle değerlendiriliyor.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0" style={{ borderTop: "1px solid #E8E8E8" }}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="py-10 px-6"
              style={{ borderRight: i < stats.length - 1 ? "1px solid #E8E8E8" : "none" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 800,
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  color: "#2C2B2B",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}
              >
                {s.value}
              </p>
              <p className="label-muted">{s.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
