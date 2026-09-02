export default function WaveTransition({
  colorClass = 'text-white',
  bgClass = 'bg-white',
  flip = false,
  isFooter = false,
}) {
  return (
    <div className={`w-full overflow-hidden leading-none ${bgClass} pointer-events-none select-none -my-0.5`}>
      <svg
        className={`relative block w-full h-[65px] sm:h-[95px] md:h-[125px] lg:h-[150px] ${
          flip ? '-scale-x-100' : ''
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
      >
        {/* Tier 1: Soft Atmospheric Background Swell */}
        <path
          d="M0,50 C300,10 620,95 940,35 C1180,-10 1340,65 1440,50 L1440,140 L0,140 Z"
          className={`fill-current ${colorClass}`}
          opacity="0.16"
        />

        {/* Tier 2: Flowing Midground Undulation */}
        <path
          d="M0,75 C240,40 500,115 780,65 C1060,20 1280,100 1440,75 L1440,140 L0,140 Z"
          className={`fill-current ${colorClass}`}
          opacity="0.42"
        />

        {/* Tier 3: Primary Sculptural Foreground Wave */}
        <path
          d="M0,95 C280,60 560,130 860,85 C1140,45 1320,115 1440,95 L1440,140 L0,140 Z"
          className={`fill-current ${colorClass}`}
        />

        {/* Tier 4: Luminous Crest Edge Highlight */}
        <path
          d="M0,95 C280,60 560,130 860,85 C1140,45 1320,115 1440,95"
          fill="none"
          stroke={isFooter ? 'rgba(37, 99, 235, 0.45)' : 'rgba(255, 255, 255, 0.75)'}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
