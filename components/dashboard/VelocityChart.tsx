'use client'
import { useEffect, useRef, useMemo } from 'react'
import { gsap, DrawSVGPlugin } from '@/lib/gsap'

interface DataPoint { day: string; volume: number; orders: number }
interface Props { data: DataPoint[]; height?: number }

export function VelocityChart({ data, height = 120 }: Props) {
  const pathRef   = useRef<SVGPathElement>(null)
  const fillRef   = useRef<SVGPathElement>(null)
  const dotsRef   = useRef<SVGGElement>(null)
  const svgRef    = useRef<SVGSVGElement>(null)
  const tipRef    = useRef<{ el: SVGGElement | null; line: SVGLineElement | null }>({ el:null, line:null })
  const W = 340, H = height, PAD = 16

  const { points, max } = useMemo(() => {
    if (!data.length) return { points:[], max:1 }
    const max = Math.max(...data.map(d => d.volume), 1)
    const w = W - PAD * 2
    const h = H - PAD * 2
    const points = data.map((d, i) => ({
      x: PAD + (i / Math.max(data.length - 1, 1)) * w,
      y: PAD + h - (d.volume / max) * h,
      ...d,
    }))
    return { points, max }
  }, [data, H])

  const linePath = useMemo(() => {
    if (points.length < 2) return ''
    return points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x},${p.y}`
      const prev = points[i - 1]
      const cx = (prev.x + p.x) / 2
      return `${acc} C ${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`
    }, '')
  }, [points])

  const fillPath = linePath
    ? `${linePath} L ${points[points.length-1].x},${H} L ${points[0].x},${H} Z`
    : ''

  useEffect(() => {
    if (!pathRef.current || !points.length) return
    gsap.fromTo(pathRef.current,
      { drawSVG:'0%' },
      { drawSVG:'100%', duration:1.4, ease:'power3.out', delay:0.5 }
    )
    gsap.fromTo(fillRef.current,
      { opacity:0 },
      { opacity:1, duration:0.8, delay:0.9 }
    )
    if (dotsRef.current) {
      gsap.fromTo(dotsRef.current.querySelectorAll('circle'),
        { scale:0, opacity:0, transformOrigin:'center' },
        { scale:1, opacity:1, stagger:0.08, duration:0.3, delay:1.2, ease:'back.out(2)' }
      )
    }
  }, [data])

  // Touch/mouse crosshair
  const handleMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg || !points.length) return
    const rect = svg.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const svgX = ((clientX - rect.left) / rect.width) * W

    let closest = points[0]
    let minDist  = Math.abs(points[0].x - svgX)
    points.forEach(p => {
      const d = Math.abs(p.x - svgX)
      if (d < minDist) { minDist = d; closest = p }
    })

    const tip  = tipRef.current.el
    const line = tipRef.current.line
    if (tip) {
      tip.setAttribute('transform', `translate(${closest.x},${closest.y})`)
      tip.style.opacity = '1'
    }
    if (line) {
      line.setAttribute('x1', String(closest.x))
      line.setAttribute('x2', String(closest.x))
      line.style.opacity = '1'
    }
  }

  const handleLeave = () => {
    if (tipRef.current.el)   tipRef.current.el.style.opacity   = '0'
    if (tipRef.current.line) tipRef.current.line.style.opacity = '0'
  }

  if (!data.length) return (
    <div className="h-20 flex items-center justify-center">
      <p className="text-xs text-ink-4 font-manrope">No data yet</p>
    </div>
  )

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height, cursor:'crosshair' }}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchEnd={handleLeave}
    >
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"   />
        </linearGradient>
        <linearGradient id="chart-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#7c3aed" />
          <stop offset="50%"  stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Fill */}
      <path ref={fillRef} d={fillPath} fill="url(#chart-fill)" opacity="0" />

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f}
          x1={PAD} y1={PAD + (H - PAD*2) * (1-f)}
          x2={W-PAD} y2={PAD + (H - PAD*2) * (1-f)}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1"
        />
      ))}

      {/* Line */}
      <path ref={pathRef} d={linePath}
        stroke="url(#chart-line)" strokeWidth="2"
        fill="none" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Dots */}
      <g ref={dotsRef}>
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5"
            fill="#7c3aed"
            stroke="rgba(13,12,26,0.8)" strokeWidth="2"
          />
        ))}
      </g>

      {/* X labels */}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={H - 2}
          textAnchor="middle"
          style={{ fontSize:9, fill:'var(--ink-4)', fontFamily:'var(--font-manrope)' }}
        >
          {p.day.slice(5)} {/* MM-DD */}
        </text>
      ))}

      {/* Crosshair line */}
      <line
        ref={el => { if (el) tipRef.current.line = el }}
        x1="0" y1={PAD} x2="0" y2={H - PAD}
        stroke="rgba(139,92,246,0.4)" strokeWidth="1"
        strokeDasharray="3,3"
        style={{ opacity:0, transition:'opacity 0.15s' }}
      />

      {/* Tooltip dot */}
      <g
        ref={el => { if (el) tipRef.current.el = el }}
        style={{ opacity:0, transition:'opacity 0.15s', pointerEvents:'none' }}
      >
        <circle r="5" fill="#8b5cf6" stroke="rgba(13,12,26,0.9)" strokeWidth="2" />
        <circle r="9" fill="rgba(139,92,246,0.2)" />
      </g>
    </svg>
  )
}
