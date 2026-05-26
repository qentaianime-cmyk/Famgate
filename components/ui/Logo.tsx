export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#F5A623" fillOpacity="0.12"/>
      <path d="M10 28V14h5l5 8 5-8h5v14h-4V20l-4 6h-4l-4-6v8h-4z" fill="#F5A623"/>
      <circle cx="32" cy="10" r="4" fill="#F5A623" fillOpacity="0.7"/>
    </svg>
  )
}
