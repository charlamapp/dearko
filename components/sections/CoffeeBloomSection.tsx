"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_burst;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float f = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    f += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return f;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.10;

  vec3 p = vec3(uv * 2.4, t * 0.5);
  p.y -= u_time * 0.10;

  float q = fbm(p + vec3(0.0, -t * 0.8, 0.0));
  float d = fbm(p + q * 1.9 + vec3(1.7, 9.2, 0.4));

  float r = length(uv * vec2(1.0, 1.4));
  float radius = u_burst * (1.55 + 0.12 * sin(u_time * 0.45));
  float mask = smoothstep(radius, radius - 1.0, r - d * 0.6);
  float dens = clamp(d * 1.75 - 0.28, 0.0, 1.0) * mask;

  vec3 cream = vec3(0.965, 0.945, 0.915);
  vec3 amber = vec3(0.80, 0.50, 0.21);
  vec3 brown = vec3(0.36, 0.19, 0.08);
  vec3 deep  = vec3(0.15, 0.075, 0.035);

  vec3 col = mix(cream, amber, smoothstep(0.0, 0.45, dens));
  col = mix(col, brown, smoothstep(0.35, 0.75, dens));
  col = mix(col, deep,  smoothstep(0.70, 1.0,  dens));

  col -= 0.10 * smoothstep(0.55, 0.0, r) * u_burst;

  gl_FragColor = vec4(col, 1.0);
}
`

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

export default function CoffeeBloomSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false })
    if (!gl) return

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return sh
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "a_pos")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, "u_res")
    const uTime = gl.getUniformLocation(prog, "u_time")
    const uBurst = gl.getUniformLocation(prog, "u_burst")

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Shader tam ekran fbm çalıştırdığı için yarı çözünürlük yeterli ve akıcı
    const scale = Math.min(window.devicePixelRatio, 1.5) * 0.55
    const resize = () => {
      canvas.width = Math.round(canvas.clientWidth * scale)
      canvas.height = Math.round(canvas.clientHeight * scale)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let raf = 0
    let visible = false
    let burstStart = -1
    const t0 = performance.now()

    const frame = (now: number) => {
      const t = (now - t0) / 1000
      if (burstStart < 0) burstStart = t
      const b = Math.min((t - burstStart) / 2.6, 1)
      const burst = 1 - Math.pow(1 - b, 3)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      gl.uniform1f(uBurst, burst)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (visible && !reduced) raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(frame)
      } else {
        cancelAnimationFrame(raf)
      }
    }, { threshold: 0.25 })
    io.observe(section)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ height: "clamp(30rem, 92vh, 56rem)" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        <p style={{
          fontFamily: "var(--font-inter)", fontSize: "0.68rem", fontWeight: 700,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.75)", marginBottom: "1rem",
        }}>
          DearKo Spesiyal
        </p>
        <h2 className="heading-xl" style={{
          color: "#fff", fontSize: "clamp(1.9rem, 5vw, 3.75rem)",
          textShadow: "0 2px 28px rgba(30,12,4,0.45)", maxWidth: "46rem", marginBottom: "1.75rem",
        }}>
          Her Gün Taze Demlenen Spesiyal Kahveniz
        </h2>
        <Link href="/urun" className="btn-white" style={{ fontSize: "0.75rem", padding: "0.8rem 1.75rem" }}>
          Kahveleri Keşfet
        </Link>
      </div>
    </section>
  )
}
