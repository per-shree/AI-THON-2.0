import { Link } from 'react-router-dom'
import BackgroundArtwork from './BackgroundArtwork'
import CountdownTimer from './CountdownTimer'
import { CalendarIcon, ClockIcon, UsersIcon, MapPinIcon } from './Icons'

const heroSponsors = [
  {
    name: '.XYZ Domains',
    logo: '/xyz_logo.png',
    url: 'https://gen.xyz',
    role: 'Official Domain Partner',
  },
  {
    name: 'Bijankur Real Estate & Developers',
    logo: '/bijankur_logo.png',
    url: '',
    role: 'Real Estate & Developers',
  },
  {
    name: 'Pravara Infotech',
    logo: '/pravara_logo.png',
    url: 'https://pravarainfotech.in/',
    role: 'IT Solutions Partner',
  },
  {
    name: 'NEXA (Mahalaxmi Automotives, Sangamner)',
    logo: '/nexa_logo.png',
    url: 'https://www.nexaexperience.com/',
    role: 'Official Automotive Partner',
    isDarkBg: true,
  },
  {
    name: 'Dainik Yuvavarta',
    logo: '/yuvavarta_logo.png',
    url: '',
    role: 'Official Media Partner',
  },
]

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#faf9f6] overflow-hidden min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Subtle Low-Contrast Skyline Background */}
      <BackgroundArtwork variant="hero" />

      <div className="max-w-5xl w-full mx-auto relative z-10 text-center flex flex-col items-center justify-center space-y-4 sm:space-y-5">
        
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-100 backdrop-blur-xs shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#2563eb]">
            NATIONAL LEVEL AI HACKATHON
          </span>
        </div>

        {/* Hero Main Heading & Tagline Group */}
        <div className="space-y-2 sm:space-y-3 max-w-full">
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-black text-[#062b59] tracking-tight leading-tight sm:leading-none break-words">
            AITHON <span className="text-[#2563eb]">2.0</span>
          </h1>
          
          <p className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#ea580c] tracking-tight uppercase leading-snug break-words">
            BUILD. INNOVATE. TRANSFORM.
          </p>
        </div>

        {/* Subtitle Quote - Responsive text wrapping */}
        <p className="text-slate-600 text-xs sm:text-sm md:text-base font-semibold tracking-wide leading-relaxed max-w-2xl mx-auto pt-0.5 px-2 text-center break-words">
          "12 Hours of Artificial Intelligence, Innovation & Real-World Problem Solving."
        </p>

        {/* Clean Event Info Pill - Vector SVG Icons */}
        <div className="w-full max-w-3xl text-xs sm:text-sm md:text-base font-bold text-[#062b59] p-3 sm:py-3.5 sm:px-6 bg-white/90 backdrop-blur-sm border border-[#edebe6] shadow-xs rounded-xl">
          <div className="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-5 gap-y-2.5 text-center">
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-[#2563eb]" /> 16 OCTOBER 2026
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

        {/* Integrated Hero Live Countdown Timer */}
        <div className="w-full max-w-xl mx-auto pt-0.5">
          <CountdownTimer variant="hero" />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full sm:w-auto max-w-xs sm:max-w-none">
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

        {/* Clean Hero Sponsors & Partners Strip */}
        <div className="w-full max-w-4xl pt-5 sm:pt-6 border-t border-[#edebe6]/80 mt-3 sm:mt-5">
          <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
            <span className="h-px w-8 sm:w-14 bg-slate-300/80" />
            <a
              href="#sponsors"
              className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 hover:text-[#2563eb] transition-colors flex items-center gap-1.5"
            >
              <span>Our Official Partners & Sponsors</span>
              <span className="text-slate-400 text-xs font-normal">↓</span>
            </a>
            <span className="h-px w-8 sm:w-14 bg-slate-300/80" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
            {heroSponsors.map((sponsor) => {
              const cardContent = (
                <div
                  className={`flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border bg-white/95 backdrop-blur-xs transition-all duration-200 shadow-2xs ${
                    sponsor.url
                      ? 'border-[#edebe6] hover:border-blue-400 hover:shadow-xs hover:-translate-y-0.5 cursor-pointer'
                      : 'border-[#edebe6] cursor-default'
                  }`}
                >
                  <div
                    className={`w-12 h-8 sm:w-14 sm:h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ${
                      sponsor.isDarkBg
                        ? 'bg-black px-1.5 py-1'
                        : 'bg-slate-50 border border-slate-100 p-1'
                    }`}
                  >
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] sm:text-xs font-bold text-[#062b59] leading-tight">
                      {sponsor.name}
                    </p>
                    <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 leading-tight mt-0.5">
                      {sponsor.role}
                    </p>
                  </div>
                </div>
              )

              return sponsor.url ? (
                <a
                  key={sponsor.name}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  {cardContent}
                </a>
              ) : (
                <div key={sponsor.name}>{cardContent}</div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}

