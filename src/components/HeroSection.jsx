import { Link } from 'react-router-dom'
import BackgroundArtwork from './BackgroundArtwork'

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#faf9f6] overflow-hidden min-h-[85vh] flex items-center justify-center">
      
      {/* Subtle Low-Contrast Skyline Background */}
      <BackgroundArtwork variant="hero" />

      <div className="max-w-5xl mx-auto relative z-10 px-6 lg:px-8 text-center flex flex-col items-center justify-center py-12 sm:py-16">
        
        <p className="text-sm font-bold uppercase tracking-widest text-[#2563eb] mb-6">
          NATIONAL LEVEL AI HACKATHON
        </p>

        <h1 className="text-6xl sm:text-8xl font-extrabold text-[#062b59] tracking-tight leading-none mb-4">
          AITHON <span className="text-[#2563eb]">2.0</span>
        </h1>
        
        <p className="text-2xl sm:text-4xl font-extrabold text-[#ea580c] tracking-tight uppercase mb-8">
          BUILD. INNOVATE. TRANSFORM.
        </p>

        <p className="text-slate-600 text-lg sm:text-2xl max-w-3xl leading-relaxed mx-auto mb-10 font-medium">
          "12 Hours of Artificial Intelligence, Innovation & Real-World Problem Solving."
        </p>

        {/* Clean Line Event Info in Warm White Pill */}
        <div className="text-sm sm:text-base font-semibold text-[#062b59] py-3.5 px-6 bg-[#faf9f6] border border-[#edebe6] shadow-xs mb-12 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 rounded-lg">
          <span>9 OCTOBER 2026</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span>12 HOURS</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-[#2563eb]">OPEN FOR ALL</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span>AVCOE, SANGAMNER</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/register"
            className="w-full sm:w-auto px-10 py-4 bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-sm text-center rounded-lg"
          >
            REGISTER NOW
          </Link>
          <a
            href="#about"
            className="w-full sm:w-auto px-10 py-4 bg-[#faf9f6] hover:bg-white text-[#062b59] border-2 border-[#062b59] font-bold text-sm uppercase tracking-wider transition-colors text-center shadow-xs rounded-lg"
          >
            EXPLORE AITHON
          </a>
        </div>
      </div>
    </section>
  )
}
