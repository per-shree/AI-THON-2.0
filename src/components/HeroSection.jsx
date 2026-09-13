import { Link } from 'react-router-dom'
import aithonHeroLogo from '../assets/aithon-hero-logo.png'
import BackgroundArtwork from './BackgroundArtwork'
import CountdownTimer from './CountdownTimer'
import { CalendarIcon, ClockIcon, UsersIcon, MapPinIcon } from './Icons'

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#fef6eb] overflow-x-hidden min-h-[calc(100dvh-100px)] sm:min-h-[calc(100vh-112px)] flex flex-col items-center justify-center pt-2.5 sm:pt-4 md:pt-5 lg:pt-6 pb-3 sm:pb-6 lg:pb-8 px-3 sm:px-6 lg:px-8">
      
      {/* City Skyline Artwork anchored and visible on the main starting hero page */}
      <BackgroundArtwork variant="hero" />

      <div className="max-w-5xl w-full mx-auto relative z-10 text-center flex flex-col items-center justify-center my-auto">
        
        {/* Top Eyebrow Tag - Sleek, Refined Professional Badge (Home page only) */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 xs:px-3 sm:px-3.5 md:px-4 py-1 sm:py-1.25 rounded-full bg-gradient-to-r from-[#062b59] via-[#0b3b75] to-[#062b59] text-white shadow-[0_3px_12px_rgba(6,43,89,0.16)] border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 mb-2.5 sm:mb-3 md:mb-4 max-w-full select-none">
          <span className="flex items-center justify-center w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white shadow-xs shrink-0">
            <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
            </svg>
          </span>
          <span className="text-[8px] xs:text-[8.5px] sm:text-[9.5px] md:text-[10px] font-bold sm:font-extrabold uppercase tracking-[0.12em] xs:tracking-[0.14em] sm:tracking-[0.16em] text-white whitespace-nowrap">
            NATIONAL LEVEL AI HACKATHON
          </span>
        </div>

        {/* Hero Official Brand Logo & Main Heading (SEO) */}
        <div className="w-full flex flex-col items-center justify-center mb-1 sm:mb-2 max-w-full">
          <h1 className="sr-only">
            AITHON 2.0 - National Level AI Hackathon
          </h1>

          {/* Grand AITHON 2.0 Brand Logo - Prominently Scaled Across Viewports */}
          <div className="relative group flex items-center justify-center w-full px-2 sm:px-4">
            <img
              src={aithonHeroLogo}
              alt="AITHON 2.0 - National Level AI Hackathon"
              className="w-full max-w-[280px] xs:max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[600px] xl:max-w-[660px] 2xl:max-w-[720px] h-auto object-contain drop-shadow-[0_10px_25px_rgba(6,43,89,0.07)] hover:scale-[1.01] transition-transform duration-500 ease-out select-none"
              style={{ aspectRatio: '1017 / 268' }}
              loading="eager"
              fetchPriority="high"
            />
          </div>

          {/* Tagline - Bold theme message */}
          <p className="mt-3 sm:mt-4 md:mt-5 text-[13px] xs:text-[15px] sm:text-base md:text-lg lg:text-xl xl:text-2xl font-black text-[#ea580c] tracking-wide sm:tracking-normal uppercase leading-tight break-words">
            BUILD. INNOVATE. TRANSFORM.
          </p>
        </div>

        {/* Subtitle Quote - Balanced text on mobile and desktop */}
        <p className="text-slate-600 text-[10.5px] xs:text-[11.5px] sm:text-[13px] md:text-sm lg:text-[15px] font-semibold tracking-wide leading-relaxed max-w-md sm:max-w-2xl mx-auto px-3 sm:px-4 text-center break-words text-balance mt-2 sm:mt-2.5 mb-3 sm:mb-4 md:mb-5">
          "12 Hours of Artificial Intelligence, Innovation & Real-World Problem Solving."
        </p>

        {/* Responsive Event Info Pill - 2 Balanced Rows on Mobile, Seamless Single Line on Desktop */}
        <div className="w-full max-w-4xl mx-auto flex justify-center px-2 sm:px-4 mb-3 sm:mb-4 md:mb-5">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] font-bold text-[#062b59] py-1.5 sm:py-2 md:py-2.5 px-3 xs:px-4 sm:px-6 bg-white/95 backdrop-blur-sm border border-[#edebe6] shadow-xs rounded-2xl sm:rounded-full max-w-full gap-y-1.5 sm:gap-y-0 select-none no-scrollbar overflow-hidden">
            {/* Mobile Row 1 / Desktop Left Segment */}
            <div className="flex items-center gap-x-2 xs:gap-x-2.5 sm:gap-x-3.5 shrink-0">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 shrink-0">
                <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563eb]" /> 23 OCTOBER 2026
              </span>
              <span className="text-slate-400 font-bold select-none shrink-0">•</span>
              <span className="inline-flex items-center gap-1 sm:gap-1.5 shrink-0">
                <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ea580c]" /> 12 HOURS
              </span>
            </div>

            {/* Desktop-only separator between segments */}
            <span className="text-slate-400 font-bold select-none hidden sm:inline-block sm:mx-3.5 shrink-0">•</span>

            {/* Mobile Row 2 / Desktop Right Segment */}
            <div className="flex items-center gap-x-2 xs:gap-x-2.5 sm:gap-x-3.5 shrink-0">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[#2563eb] shrink-0">
                <UsersIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563eb]" /> OPEN FOR ALL
              </span>
              <span className="text-slate-400 font-bold select-none shrink-0">•</span>
              <span className="inline-flex items-center gap-1 sm:gap-1.5 shrink-0">
                <MapPinIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" /> AVCOE, SANGAMNER
              </span>
            </div>
          </div>
        </div>

        {/* Integrated Hero Live Countdown Timer */}
        <div className="w-full max-w-md mx-auto mb-3.5 sm:mb-4.5 md:mb-5 px-1 sm:px-0">
          <CountdownTimer variant="hero" />
        </div>

        {/* Action Buttons - Distinctly positioned and mobile responsive */}
        <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-3.5 md:gap-4 w-full sm:w-auto relative z-20 mb-2 sm:mb-3 px-2 sm:px-0">
          <Link
            to="/register"
            className="flex-1 sm:flex-none px-4 xs:px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-[10.5px] xs:text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-sm text-center rounded-xl hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
          >
            REGISTER NOW
          </Link>
          <a
            href="#about"
            className="flex-1 sm:flex-none px-4 xs:px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 bg-white hover:bg-[#faf9f6] text-[#062b59] border-2 border-[#062b59] font-bold text-[10.5px] xs:text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 text-center shadow-xs rounded-xl hover:border-[#2563eb] hover:text-[#2563eb] hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
          >
            EXPLORE AITHON
          </a>
        </div>

      </div>

      {/* Clean Bottom Boundary Seam into Sponsors section (#faf9f6) */}
      <div className="absolute bottom-0 inset-x-0 h-6 sm:h-8 bg-gradient-to-b from-transparent to-[#faf9f6]/70 pointer-events-none z-10" />
    </section>
  )
}
