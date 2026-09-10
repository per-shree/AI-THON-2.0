import { Link } from 'react-router-dom'
import aithonHeroLogo from '../assets/aithon-hero-logo.png'
import BackgroundArtwork from './BackgroundArtwork'
import CountdownTimer from './CountdownTimer'
import { CalendarIcon, ClockIcon, UsersIcon, MapPinIcon } from './Icons'

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#faf9f6] overflow-hidden min-h-[calc(100vh-146px)] flex flex-col items-center justify-center pt-2 sm:pt-3 lg:pt-4 pb-4 sm:pb-6 px-3 sm:px-6 lg:px-8">
      
      {/* City Skyline Artwork anchored to the bottom of the home page */}
      <BackgroundArtwork variant="hero" />

      <div className="max-w-4xl w-full mx-auto relative z-10 text-center flex flex-col items-center justify-center space-y-2 sm:space-y-2.5 my-auto">
        
        {/* Top Eyebrow Tag - Premium Professional Badge */}
        <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#062b59] via-[#0b3b75] to-[#062b59] text-white shadow-[0_4px_16px_rgba(6,43,89,0.18)] border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white shadow-xs shrink-0">
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
            </svg>
          </span>
          <span className="text-[10px] sm:text-[11.5px] font-black uppercase tracking-[0.18em] sm:tracking-[0.22em] text-white">
            NATIONAL LEVEL AI HACKATHON
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse hidden xs:inline-block shrink-0" />
        </div>

        {/* Hero Official Brand Logo & Main Heading (SEO) */}
        <div className="w-full flex flex-col items-center justify-center space-y-1 sm:space-y-1.5 max-w-full">
          <h1 className="sr-only">
            AITHON 2.0 - National Level AI Hackathon
          </h1>

          <div className="relative group flex items-center justify-center w-full px-2">
            {/* Ambient Multi-Spectrum Glow harmonized with Navy & Orange brand identity */}
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-600/10 via-orange-500/15 to-blue-600/10 blur-xl sm:blur-2xl rounded-3xl -z-10 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
            
            <img
              src={aithonHeroLogo}
              alt="AITHON 2.0 - National Level AI Hackathon"
              className="w-full max-w-[250px] xs:max-w-[300px] sm:max-w-[380px] md:max-w-[430px] lg:max-w-[460px] h-auto object-contain drop-shadow-[0_8px_20px_rgba(6,43,89,0.06)] hover:scale-[1.01] transition-transform duration-500 ease-out select-none"
              style={{ aspectRatio: '1017 / 268' }}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#ea580c] tracking-tight uppercase leading-tight break-words">
            BUILD. INNOVATE. TRANSFORM.
          </p>
        </div>

        {/* Subtitle Quote */}
        <p className="text-slate-600 text-[11px] sm:text-xs md:text-[13px] font-semibold tracking-wide leading-tight max-w-xl mx-auto px-2 text-center break-words">
          "12 Hours of Artificial Intelligence, Innovation & Real-World Problem Solving."
        </p>

        {/* Clean Event Info Pill */}
        <div className="w-full max-w-2xl text-[11px] sm:text-xs md:text-[13px] font-bold text-[#062b59] py-1.5 sm:py-2 px-3 sm:px-5 bg-white/95 backdrop-blur-sm border border-[#edebe6] shadow-2xs rounded-xl">
          <div className="flex flex-wrap justify-center items-center gap-x-2.5 sm:gap-x-4 gap-y-1 text-center">
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-[#2563eb]" /> 23 OCTOBER 2026
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="w-3.5 h-3.5 text-[#ea580c]" /> 12 HOURS
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5 text-[#2563eb]">
              <UsersIcon className="w-3.5 h-3.5 text-[#2563eb]" /> OPEN FOR ALL
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="w-3.5 h-3.5 text-emerald-600" /> AVCOE, SANGAMNER
            </span>
          </div>
        </div>

        {/* Integrated Hero Live Countdown Timer */}
        <div className="w-full max-w-md mx-auto">
          <CountdownTimer variant="hero" />
        </div>

        {/* Action Buttons - At the end of the home page */}
        <div className="pt-2 sm:pt-2.5 flex flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto relative z-20">
          <Link
            to="/register"
            className="px-7 sm:px-9 py-2.5 sm:py-3 bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs sm:text-[13px] uppercase tracking-wider transition-all duration-200 shadow-sm text-center rounded-xl hover:shadow-md active:scale-95"
          >
            REGISTER NOW
          </Link>
          <a
            href="#about"
            className="px-7 sm:px-9 py-2.5 sm:py-3 bg-white hover:bg-[#faf9f6] text-[#062b59] border-2 border-[#062b59] font-bold text-xs sm:text-[13px] uppercase tracking-wider transition-all duration-200 text-center shadow-xs rounded-xl hover:border-[#2563eb] hover:text-[#2563eb] active:scale-95"
          >
            EXPLORE AITHON
          </a>
        </div>

      </div>
    </section>
  )
}
