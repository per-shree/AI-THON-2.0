export default function WaveTransition({
  colorClass = 'text-white',
  bgClass = 'bg-white',
  flip = false,
  isFooter = false,
}) {
  return (
    <div className={`w-full overflow-hidden leading-none ${bgClass} pointer-events-none select-none -my-0.5 relative`}>
      <style>{`
        @keyframes waveUpAndDown1 {
          0% { transform: translate3d(0, 0px, 0); }
          50% { transform: translate3d(0, -8px, 0); }
          100% { transform: translate3d(0, 0px, 0); }
        }
        @keyframes waveUpAndDown2 {
          0% { transform: translate3d(0, 0px, 0); }
          50% { transform: translate3d(0, 9px, 0); }
          100% { transform: translate3d(0, 0px, 0); }
        }
        @keyframes waveUpAndDown3 {
          0% { transform: translate3d(0, 0px, 0); }
          50% { transform: translate3d(0, -6px, 0); }
          100% { transform: translate3d(0, 0px, 0); }
        }
        .animate-wave-up-down-1 {
          animation: waveUpAndDown1 6s ease-in-out infinite;
        }
        .animate-wave-up-down-2 {
          animation: waveUpAndDown2 4.5s ease-in-out infinite;
        }
        .animate-wave-up-down-3 {
          animation: waveUpAndDown3 3.5s ease-in-out infinite;
        }
      `}</style>

      <svg
        className="w-full h-[65px] sm:h-[95px] md:h-[125px] lg:h-[145px] block shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
      >
        {flip ? (
          /* X-Y Mirrored Wave Curve Paths (Deep Bottom Extension L1440,200) */
          <>
            <path
              d="M0,35 C320,95 640,10 940,50 C1260,95 1380,-10 1440,35 L1440,200 L0,200 Z"
              className={`fill-current ${colorClass} animate-wave-up-down-1`}
              opacity="0.25"
            />
            <path
              d="M0,65 C280,115 540,40 780,75 C1080,115 1300,20 1440,65 L1440,200 L0,200 Z"
              className={`fill-current ${colorClass} animate-wave-up-down-2`}
              opacity="0.55"
            />
            <path
              d="M0,85 C300,130 580,60 860,95 C1160,130 1340,45 1440,85 L1440,200 L0,200 Z"
              className={`fill-current ${colorClass} animate-wave-up-down-3`}
            />
            <path
              d="M0,85 C300,130 580,60 860,95 C1160,130 1340,45 1440,85"
              fill="none"
              stroke={isFooter ? 'rgba(37, 99, 235, 0.65)' : 'rgba(255, 255, 255, 0.85)'}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-wave-up-down-3"
            />
          </>
        ) : (
          /* Standard Wave Curve Paths (Deep Bottom Extension L1440,200) */
          <>
            <path
              d="M0,50 C300,10 620,95 940,35 C1180,-10 1340,65 1440,50 L1440,200 L0,200 Z"
              className={`fill-current ${colorClass} animate-wave-up-down-1`}
              opacity="0.25"
            />
            <path
              d="M0,75 C240,40 500,115 780,65 C1060,20 1280,100 1440,75 L1440,200 L0,200 Z"
              className={`fill-current ${colorClass} animate-wave-up-down-2`}
              opacity="0.55"
            />
            <path
              d="M0,95 C280,60 560,130 860,85 C1140,45 1320,115 1440,95 L1440,200 L0,200 Z"
              className={`fill-current ${colorClass} animate-wave-up-down-3`}
            />
            <path
              d="M0,95 C280,60 560,130 860,85 C1140,45 1320,115 1440,95"
              fill="none"
              stroke={isFooter ? 'rgba(37, 99, 235, 0.65)' : 'rgba(255, 255, 255, 0.85)'}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-wave-up-down-3"
            />
          </>
        )}
      </svg>
    </div>
  )
}


