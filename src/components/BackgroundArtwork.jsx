import citySkylineArtwork from '../assets/city-skyline-artwork.png'

export default function BackgroundArtwork({ variant = 'hero' }) {
  if (variant === 'hero') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#fef6eb]">
        {/* Subtle Warm Horizon Glow */}
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[260px] bg-gradient-to-t from-amber-500/8 via-orange-400/4 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Premium City Skyline Artwork - Mobile 100% untouched, Desktop with proper framing & gradient */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-[46%] sm:h-[48%] md:h-[50%] lg:h-[52%] max-h-[500px] pointer-events-none flex items-end justify-center overflow-hidden z-0">
          <img
            src={citySkylineArtwork}
            alt="AITHON 2.0 Skyline Artwork"
            className="w-full h-full object-cover object-[center_78%] sm:object-[center_65%] md:object-[center_64%] lg:object-[center_63%] select-none contrast-[1.02] saturate-[1.03]"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 14%, black 84%, rgba(0,0,0,0.45) 94%, transparent 100%)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 14%, black 84%, rgba(0,0,0,0.45) 94%, transparent 100%)',
            }}
            loading="eager"
            fetchPriority="high"
          />

          {/* Smooth Top Gradient seamlessly blending artwork sky into #fef6eb on desktop */}
          <div className="absolute top-0 inset-x-0 h-8 sm:h-16 lg:h-20 bg-gradient-to-b from-[#fef6eb] via-[#fef6eb]/70 to-transparent pointer-events-none" />

          {/* Soft Bottom Transition feathering the reflection into the base */}
          <div className="absolute bottom-0 inset-x-0 h-8 sm:h-14 lg:h-16 bg-gradient-to-t from-[#fef6eb]/50 via-[#fef6eb]/20 to-transparent pointer-events-none" />

          {/* Gentle side vignettes to seamlessly feather edges */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-28 lg:w-36 bg-gradient-to-r from-[#fef6eb] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-28 lg:w-36 bg-gradient-to-l from-[#fef6eb] to-transparent pointer-events-none" />
        </div>
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
