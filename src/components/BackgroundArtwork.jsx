export default function BackgroundArtwork({ variant = 'hero' }) {
  if (variant === 'hero') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Radial Ambient Lighting in warm skin tones */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#d4bba0]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#c4a482]/25 rounded-full blur-3xl" />

        {/* Subtle Tech Dot Matrix with smooth top/bottom fade masks */}
        <div
          className="absolute inset-0 opacity-[0.20]"
          style={{
            backgroundImage: 'radial-gradient(circle, #cba483 1.2px, transparent 1.2px)',
            backgroundSize: '32px 32px',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
          }}
        />

        {/* City Skyline Silhouette SVG Layer in Medium Dark Skin Tone */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-40 sm:h-56 opacity-25 text-[#c8a98b]"
          viewBox="0 0 1440 220"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* City / Campus Building Silhouettes in medium dark skin color */}
          <path
            d="M0,220 L0,160 L40,160 L40,120 L90,120 L90,160 L140,160 L140,90 L200,90 L200,160 L240,160 L240,140 L300,140 L300,160 L360,160 L360,80 L420,80 L420,160 L480,160 L480,130 L550,130 L550,160 L620,160 L620,100 L680,100 L680,160 L740,160 L740,70 L820,70 L820,160 L890,160 L890,120 L960,120 L960,160 L1040,160 L1040,90 L1110,90 L1110,160 L1180,160 L1180,140 L1260,140 L1260,160 L1340,160 L1340,110 L1440,110 L1440,220 Z"
            fill="currentColor"
          />
          {/* Technology Circuit Overlays */}
          <path
            d="M50,120 L50,50 L120,50 M300,140 L300,30 L450,30 M740,70 L740,20 L850,20 M1110,90 L1110,40 L1220,40"
            stroke="#2563eb"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx="120" cy="50" r="4" fill="#2563eb" />
          <circle cx="450" cy="30" r="4" fill="#2563eb" />
          <circle cx="850" cy="20" r="4" fill="#ea580c" />
          <circle cx="1220" cy="40" r="4" fill="#2563eb" />
        </svg>

        {/* Slow Floating Animated Geometrics */}
        <div className="absolute top-12 left-12 w-16 h-16 rounded-full border border-[#cba483]/40 opacity-40 animate-pulse pointer-events-none" />
        <div className="absolute top-1/3 right-16 w-24 h-24 rounded-3xl border border-[#cba483]/30 opacity-30 rotate-12 pointer-events-none" />
      </div>
    )
  }

  if (variant === 'section') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 opacity-[0.20]"
          style={{
            backgroundImage: 'radial-gradient(#cba483 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>
    )
  }

  return null
}
