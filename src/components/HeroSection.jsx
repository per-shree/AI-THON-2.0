import { Link } from 'react-router-dom'
import aithonHeroLogo from '../assets/aithon-hero-logo.png'
import BackgroundArtwork from './BackgroundArtwork'
import CountdownTimer from './CountdownTimer'
import { CalendarIcon, ClockIcon, UsersIcon, MapPinIcon } from './Icons'

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#fef6eb] overflow-hidden min-h-[calc(100vh-112px)] flex flex-col items-center justify-center pt-3 sm:pt-6 lg:pt-8 pb-8 sm:pb-12 lg:pb-16 px-3 sm:px-6 lg:px-8">
      
      {/* City Skyline Artwork anchored and visible on the main starting hero page */}
      <BackgroundArtwork variant="hero" />

      <div className="max-w-4xl w-full mx-auto relative z-10 text-center flex flex-col items-center justify-center my-auto">
        
        {/* Top Eyebrow Tag - Premium Professional Badge */}
        <div className="inline-flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#062b59] via-[#0b3b75] to-[#062b59] text-white shadow-[0_4px_16px_rgba(6,43,89,0.18)] border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 mb-3.5 sm:mb-6 max-w-full">
          <span className="flex items-center justify-center w-3.5 h-3.5 xs:w-4 xs:h-4 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white shadow-xs shrink-0">
            <svg className="w-2 xs:w-2.5 h-2 xs:h-2.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
            </svg>
          </span>
          <span className="text-[9.5px] xs:text-[10.5px] sm:text-xs font-black uppercase tracking-[0.14em] xs:tracking-[0.18em] sm:tracking-[0.22em] text-white whitespace-nowrap">
            NATIONAL LEVEL AI HACKATHON
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse hidden xs:inline-block shrink-0" />
        </div>

        {/* Hero Official Brand Logo & Main Heading (SEO) */}
        <div className="w-full flex flex-col items-center justify-center mb-2.5 sm:mb-4 max-w-full">
          <h1 className="sr-only">
            AITHON 2.0 - National Level AI Hackathon
          </h1>

          <div className="relative group flex items-center justify-center w-full px-2">
            <img
              src={aithonHeroLogo}
              alt="AITHON 2.0 - National Level AI Hackathon"
              className="w-full max-w-[240px] xs:max-w-[300px] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[500px] h-auto object-contain drop-shadow-[0_8px_20px_rgba(6,43,89,0.06)] hover:scale-[1.01] transition-transform duration-500 ease-out select-none"
              style={{ aspectRatio: '1017 / 268' }}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          
          <p className="mt-2.5 sm:mt-4 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#ea580c] tracking-tight uppercase leading-tight break-words">
            BUILD. INNOVATE. TRANSFORM.
          </p>
        </div>

        {/* Subtitle Quote */}
        <p className="text-slate-600 text-[11px] xs:text-xs sm:text-sm md:text-[14px] font-semibold tracking-wide leading-relaxed max-w-xl mx-auto px-2 sm:px-4 text-center break-words mb-2.5 sm:mb-4">
          "12 Hours of Artificial Intelligence, Innovation & Real-World Problem Solving."
        </p>

        {/* Clean Event Info Pill - Guaranteed Single Line with Ample Space Above & Mobile Scaled */}
        <div className="w-full max-w-4xl mx-auto flex justify-center px-1 sm:px-2 mt-3 sm:mt-6 md:mt-7 mb-5 sm:mb-8 overflow-hidden">
          <div className="inline-flex items-center justify-center text-[9px] xs:text-[10.5px] sm:text-[12.5px] md:text-[13px] font-bold text-[#062b59] py-1.5 xs:py-2 sm:py-2.5 px-2.5 xs:px-4 sm:px-6 bg-white/95 backdrop-blur-sm border border-[#edebe6] shadow-xs rounded-full whitespace-nowrap overflow-x-auto max-w-full">
            <div className="flex items-center gap-x-1.5 xs:gap-x-2.5 sm:gap-x-3.5 md:gap-x-4 text-center shrink-0">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 shrink-0">
                <CalendarIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#2563eb]" /> 23 OCTOBER 2026
              </span>
              <span className="text-slate-300 select-none shrink-0">•</span>
              <span className="inline-flex items-center gap-1 sm:gap-1.5 shrink-0">
                <ClockIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#ea580c]" /> 12 HOURS
              </span>
              <span className="text-slate-300 select-none shrink-0">•</span>
              <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[#2563eb] shrink-0">
                <UsersIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#2563eb]" /> OPEN FOR ALL
              </span>
              <span className="text-slate-300 select-none shrink-0">•</span>
              <span className="inline-flex items-center gap-1 sm:gap-1.5 shrink-0">
                <MapPinIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-emerald-600" /> AVCOE, SANGAMNER
              </span>
            </div>
          </div>
        </div>

        {/* Integrated Hero Live Countdown Timer */}
        <div className="w-full max-w-md mx-auto mb-5 sm:mb-8 px-1 sm:px-0">
          <CountdownTimer variant="hero" />
        </div>

        {/* Action Buttons - Distinctly positioned and mobile responsive */}
        <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto relative z-20 mb-2 sm:mb-4 px-2 sm:px-0">
          <Link
            to="/register"
            className="flex-1 sm:flex-none px-5 xs:px-7 sm:px-10 py-2.5 sm:py-3.5 bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-[11px] xs:text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-sm text-center rounded-xl hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
          >
            REGISTER NOW
          </Link>
          <a
            href="#about"
            className="flex-1 sm:flex-none px-5 xs:px-7 sm:px-10 py-2.5 sm:py-3.5 bg-white hover:bg-[#faf9f6] text-[#062b59] border-2 border-[#062b59] font-bold text-[11px] xs:text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 text-center shadow-xs rounded-xl hover:border-[#2563eb] hover:text-[#2563eb] hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
          >
            EXPLORE AITHON
          </a>
        </div>

      </div>
    </section>
  )
}
