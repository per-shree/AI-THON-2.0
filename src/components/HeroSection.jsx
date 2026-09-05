import { Link } from 'react-router-dom'
import BackgroundArtwork from './BackgroundArtwork'

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#faf9f6] overflow-hidden min-h-[85vh] flex items-center justify-center py-12 lg:py-20">
      
      {/* Subtle Low-Contrast Skyline Background */}
      <BackgroundArtwork variant="hero" />

      <div className="max-w-5xl mx-auto relative z-10 px-6 lg:px-8 text-center flex flex-col items-center justify-center space-y-6 sm:space-y-7">
        
        {/* Top Eyebrow Tag */}
        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#2563eb]">
          NATIONAL LEVEL AI HACKATHON
        </p>

        {/* Hero Main Heading & Tagline Group */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-[#062b59] tracking-tight leading-tight sm:leading-none">
            AITHON <span className="text-[#2563eb]">2.0</span>
          </h1>
          
          <p className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#ea580c] tracking-tight uppercase leading-snug">
            BUILD. INNOVATE. TRANSFORM.
          </p>
        </div>

        {/* Single-Line Quote Subtitle */}
        <p className="text-slate-600 text-xs sm:text-sm md:text-base font-semibold tracking-wide whitespace-nowrap leading-relaxed max-w-none pt-1">
          "12 Hours of Artificial Intelligence, Innovation & Real-World Problem Solving."
        </p>

        {/* Clean Event Info Pill */}
        <div className="text-xs sm:text-sm md:text-base font-bold text-[#062b59] py-3 px-6 bg-white/80 backdrop-blur-xs border border-[#edebe6] shadow-xs flex flex-wrap justify-center items-center gap-x-4 gap-y-2 rounded-xl mt-2">
          <span>9 OCTOBER 2026</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span>12 HOURS</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-[#2563eb]">OPEN FOR ALL</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span>AVCOE, SANGAMNER</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto px-10 py-4 bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-colors shadow-sm text-center rounded-xl"
          >
            REGISTER NOW
          </Link>
          <a
            href="#about"
            className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-[#faf9f6] text-[#062b59] border-2 border-[#062b59] font-bold text-xs sm:text-sm uppercase tracking-widest transition-colors text-center shadow-xs rounded-xl"
          >
            EXPLORE AITHON
          </a>
        </div>
      </div>
    </section>
  )
}

