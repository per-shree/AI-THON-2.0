import citySkylineArtwork from '../assets/city-skyline-artwork.png'

export default function BackgroundArtwork({ variant = 'hero' }) {
  if (variant === 'hero') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#fef6eb]">
        {/* Premium High-Resolution Illustrated City Skyline Artwork with Water Reflection */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-[56%] sm:h-[60%] md:h-[64%] lg:h-[68%] max-h-[580px] pointer-events-none flex items-end justify-center overflow-hidden z-0">
          <img
            src={citySkylineArtwork}
            alt="AITHON 2.0 Skyline Artwork"
            className="w-full h-full object-cover object-[center_36%] sm:object-[center_34%] md:object-[center_32%] select-none"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 60%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0.12) 90%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 60%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0.12) 90%, transparent 100%)',
            }}
            loading="eager"
            fetchPriority="high"
          />

          {/* Smooth Top Gradient matching exact sky color #fef6eb */}
          <div className="absolute top-0 inset-x-0 h-28 sm:h-40 bg-gradient-to-b from-[#fef6eb] via-[#fef6eb]/60 to-transparent pointer-events-none" />

          {/* Smooth Left Edge Gradient matching #fef6eb */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 md:w-48 bg-gradient-to-r from-[#fef6eb] via-[#fef6eb]/60 to-transparent pointer-events-none" />

          {/* Smooth Right Edge Gradient matching #fef6eb */}
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 md:w-48 bg-gradient-to-l from-[#fef6eb] via-[#fef6eb]/60 to-transparent pointer-events-none" />

          {/* Soft Bottom Gradient to faint the reflection into #fef6eb */}
          <div className="absolute bottom-0 inset-x-0 h-24 sm:h-36 md:h-44 bg-gradient-to-t from-[#fef6eb] via-[#fef6eb]/80 to-transparent pointer-events-none" />
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
