export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#431407"/>
      <rect width="40" height="40" rx="10" fill="url(#lg)" fillOpacity="0.6"/>
      <path d="M11 28V14l9 10 9-10v14h-4V21l-5 6-5-6v7H11z" fill="#f97316"/>
      <circle cx="33" cy="9" r="3.5" fill="#f97316" fillOpacity="0.8"/>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316" stopOpacity="0.2"/>
          <stop offset="1" stopColor="#ea580c" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
