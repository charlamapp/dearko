"use client"

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// ISO numeric country IDs + flag + marker coords
const ORIGINS: Record<string, { flag: string; coords: [number, number]; name: string }> = {
  "231": { flag: "🇪🇹", coords: [40.5,  8.0],  name: "Etiyopya"  },
  "170": { flag: "🇨🇴", coords: [-73.5,  5.5],  name: "Kolombiya" },
  "320": { flag: "🇬🇹", coords: [-90.5, 15.5],  name: "Guatemala" },
  "404": { flag: "🇰🇪", coords: [37.5,   0.2],  name: "Kenya"     },
  "76":  { flag: "🇧🇷", coords: [-51.0,-10.0],  name: "Brezilya"  },
  "188": { flag: "🇨🇷", coords: [-84.0, 10.5],  name: "Kosta Rika"},
}

export default function WorldMap() {
  return (
    <div style={{ width: "100%", background: "#F7F5F1", borderRadius: 2, overflow: "hidden" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [10, 8] }}
        style={{ width: "100%", height: "auto" }}
        viewBox="0 0 800 500"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
              const isOrigin = !!ORIGINS[String(geo.id)]
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isOrigin ? "#6C8145" : "#D6D2CB"}
                  stroke="#F7F5F1"
                  strokeWidth={0.6}
                  style={{
                    default: { outline: "none" },
                    hover:   { outline: "none", fill: isOrigin ? "#5a6d38" : "#D6D2CB" },
                    pressed: { outline: "none" },
                  }}
                />
              )
            })
          }
        </Geographies>

        {Object.entries(ORIGINS).map(([id, { flag, coords, name }]) => (
          <Marker key={id} coordinates={coords}>
            {/* Pulse ring */}
            <circle r={7} fill="#6C8145" opacity={0.2} />
            {/* Dot */}
            <circle r={4} fill="#FFFFFF" stroke="#6C8145" strokeWidth={2} />
            {/* Flag emoji */}
            <text
              textAnchor="middle"
              y={-12}
              style={{ fontSize: 14, userSelect: "none", pointerEvents: "none" }}
            >
              {flag}
            </text>
          </Marker>
        ))}
      </ComposableMap>

      {/* Legend */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem",
        padding: "0.75rem 1rem 1rem",
        borderTop: "1px solid #EAE7E1",
      }}>
        {Object.values(ORIGINS).map(({ flag, name }) => (
          <span key={name} style={{
            fontFamily: "var(--font-inter)", fontSize: "0.72rem",
            fontWeight: 600, color: "#5E5C5C",
            display: "flex", alignItems: "center", gap: "0.3rem",
          }}>
            {flag} {name}
          </span>
        ))}
      </div>
    </div>
  )
}
