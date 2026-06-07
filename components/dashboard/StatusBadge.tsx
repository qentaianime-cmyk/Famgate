interface Props { status: 'PAID' | 'PENDING' | 'EXPIRED' | string }

const MAP = {
  PAID:    { label:'Paid',    bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.25)',  color:'#10b981', dot:'#10b981' },
  PENDING: { label:'Pending', bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.25)',  color:'#f59e0b', dot:'#f59e0b' },
  EXPIRED: { label:'Expired', bg:'rgba(100,100,120,0.1)', border:'rgba(100,100,120,0.2)',  color:'var(--ink-3)', dot:'var(--ink-4)' },
}

export function StatusBadge({ status }: Props) {
  const s = MAP[status as keyof typeof MAP] ?? MAP.EXPIRED
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-syne font-bold"
      style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{
          background: s.dot,
          boxShadow: status === 'PAID' ? '0 0 4px rgba(16,185,129,0.7)' :
                     status === 'PENDING' ? '0 0 4px rgba(245,158,11,0.7)' : 'none',
          animation: status === 'PENDING' ? 'ping 1.5s ease-in-out infinite' : 'none',
        }} />
      {s.label}
    </span>
  )
}
