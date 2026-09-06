import { Link } from 'react-router-dom'
import BackgroundArtwork from './BackgroundArtwork'
import { CalendarIcon, ClockIcon, UsersIcon, MapPinIcon } from './Icons'

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#faf9f6] overflow-hidden min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center py-10 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
      
      {/* Subtle Low-Contrast Skyline Background */}
      <BackgroundArtwork variant="hero" />

      <div className="max-w-5xl w-full mx-auto relative z-10 text-center flex flex-col items-center justify-center space-y-5 sm:space-y-7">
        
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-100 backdrop-blur-xs shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#2563eb]">
            NATIONAL LEVEL AI HACKATHON
          </span>
        </div>

        {/* Hero Main Heading & Tagline Group */}
        <div className="space-y-2 sm:space-y-4 max-w-full">
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-black text-[#062b59] tracking-tight leading-tight sm:leading-none break-words">
            AITHON <span className="text-[#2563eb]">2.0</span>
          </h1>
          
          <p className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#ea580c] tracking-tight uppercase leading-snug break-words">
            BUILD. INNOVATE. TRANSFORM.
          </p>
        </div>

        {/* Subtitle Quote - Responsive text wrapping */}
        <p className="text-slate-600 text-xs sm:text-sm md:text-base font-semibold tracking-wide leading-relaxed max-w-2xl mx-auto pt-1 px-2 text-center break-words">
          "12 Hours of Artificial Intelligence, Innovation & Real-World Problem Solving."
        </p>

        {/* Clean Event Info Pill - Vector SVG Icons */}
        <div className="w-full max-w-3xl text-xs sm:text-sm md:text-base font-bold text-[#062b59] p-3 sm:py-3.5 sm:px-6 bg-white/90 backdrop-blur-sm border border-[#edebe6] shadow-xs rounded-xl mt-2">
          <div className="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-5 gap-y-2.5 text-center">
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-[#2563eb]" /> 9 OCTOBER 2026
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4 text-[#ea580c]" /> 12 HOURS
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5 text-[#2563eb]">
              <UsersIcon className="w-4 h-4 text-[#2563eb]" /> OPEN FOR ALL
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-emerald-600" /> AVCOE, SANGAMNER
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full sm:w-auto max-w-xs sm:max-w-none">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 shadow-sm text-center rounded-xl hover:shadow-md"
          >
            REGISTER NOW
          </Link>
          <a
            href="#about"
            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-white hover:bg-[#faf9f6] text-[#062b59] border-2 border-[#062b59] font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 text-center shadow-xs rounded-xl hover:border-[#2563eb] hover:text-[#2563eb]"
          >
            EXPLORE AITHON
          </a>
        </div>
      </div>
    </section>
  )
}

