import React from 'react'
import { ExternalLink, Handshake, Sparkles } from 'lucide-react'

export default function SponsorsSection() {
  const sponsors = [
    {
      name: '.XYZ Domains',
      logo: '/xyz_logo.png',
      url: 'https://gen.xyz',
      tier: 'ASSOCIATE PARTNER',
      desc: 'Official Domain Partner',
      isActive: true
    },
    {
      name: 'Bijankur Real Estate',
      logo: '/bijankur_logo.png',
      url: '#',
      tier: 'ASSOCIATE PARTNER',
      desc: 'Real Estate & Developers',
      isActive: true,
      isLargeLogo: true
    },
    {
      name: 'Pravara Infotech',
      logo: '/pravara_logo.png',
      url: 'https://pravarainfotech.in/',
      tier: 'ASSOCIATE PARTNER',
      desc: 'IT & Software Solutions',
      isActive: true
    },
    {
      name: 'SoulSoft Infotech',
      logo: '/soulsoft_logo.png',
      url: 'https://soulsoft.in/',
      tier: 'ASSOCIATE PARTNER',
      desc: 'Customised Software Solutions',
      isActive: true
    },
    {
      name: 'NEXA (Maruti Suzuki)',
      logo: '/nexa_logo.png',
      url: 'https://www.nexaexperience.com/',
      tier: 'ASSOCIATE PARTNER',
      desc: 'Automotive Partner',
      isActive: true,
      isFullBox: true
    },
    {
      name: 'Title Sponsor',
      logo: null,
      url: '#',
      tier: 'TITLE SPONSOR',
      desc: 'Announcing Soon',
      isActive: false
    },
    {
      name: 'Powered By Partner',
      logo: null,
      url: '#',
      tier: 'POWERED BY',
      desc: 'Announcing Soon',
      isActive: false
    },
    {
      name: 'Community Partner',
      logo: null,
      url: '#',
      tier: 'COMMUNITY PARTNER',
      desc: 'Announcing Soon',
      isActive: false
    }
  ]

  const renderStrapItems = (keyPrefix = 'strap1', isAriaHidden = false) => (
    <div className="flex items-center gap-5 shrink-0 px-2" aria-hidden={isAriaHidden}>
      {sponsors.map((item, idx) => {
        const hasValidLink = item.url && item.url !== '#'

        if (item.isActive && hasValidLink) {
          return (
            <a
              key={`${keyPrefix}-${idx}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white border border-[#edebe6] hover:border-[#2563eb] rounded-2xl px-4 py-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 shrink-0 h-20 sm:h-22 w-72 sm:w-84 cursor-pointer"
            >
              {/* Logo Box */}
              <div className={`w-20 h-14 sm:w-24 sm:h-16 rounded-xl ${item.isFullBox ? 'bg-black border-slate-900 overflow-hidden' : 'bg-slate-50 border-slate-100 p-1.5'} flex items-center justify-center shrink-0 group-hover:bg-blue-50/40 transition-colors`}>
                <img
                  src={item.logo}
                  alt={item.name}
                  className={
                    item.isFullBox
                      ? 'w-full h-full object-contain object-center p-1 bg-black group-hover:scale-105 transition-transform'
                      : item.isLargeLogo
                      ? 'max-h-14 sm:max-h-16 scale-125 max-w-full object-contain group-hover:scale-105 transition-transform'
                      : 'max-h-10 sm:max-h-12 max-w-full object-contain group-hover:scale-105 transition-transform'
                  }
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] font-black text-[#2563eb] uppercase tracking-wider bg-blue-50/90 px-1 py-0.5 rounded inline-block leading-none">
                  {item.tier}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-[#062b59] group-hover:text-[#2563eb] transition-colors truncate mt-0.5">
                  {item.name}
                </h3>
                <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>

              <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#2563eb] shrink-0" />
            </a>
          )
        }

        if (item.isActive && !hasValidLink) {
          return (
            <div
              key={`${keyPrefix}-${idx}`}
              className="group relative bg-white border border-[#edebe6] rounded-2xl px-4 py-3 flex items-center gap-4 shadow-sm shrink-0 h-20 sm:h-22 w-72 sm:w-84 cursor-default"
            >
              {/* Logo Box */}
              <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <img
                  src={item.logo}
                  alt={item.name}
                  className={`${item.isLargeLogo ? 'max-h-14 sm:max-h-16 scale-125' : 'max-h-10 sm:max-h-12'} max-w-full object-contain`}
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] font-black text-[#2563eb] uppercase tracking-wider bg-blue-50/90 px-1 py-0.5 rounded inline-block leading-none">
                  {item.tier}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-[#062b59] truncate mt-0.5">
                  {item.name}
                </h3>
                <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          )
        }

        return (
          <div
            key={`${keyPrefix}-${idx}`}
            className="bg-white/60 border border-dashed border-[#edebe6] rounded-2xl px-4 py-3 flex items-center gap-3.5 shrink-0 h-20 sm:h-22 w-64 sm:w-72"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100/80 border border-slate-200/60 flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-widest block leading-none">
                {item.tier}
              </span>
              <span className="text-xs sm:text-sm font-black text-[#062b59]/70 tracking-tight block mt-0.5">
                {item.desc}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <section id="sponsors" className="w-full bg-[#faf9f6] py-6 sm:py-8 border-b border-[#edebe6] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#edebe6]/80">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 text-[#2563eb] leading-none">
              <Sparkles className="w-2.5 h-2.5" />
              Partners & Supporters
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#062b59] tracking-tight">
              Our Official Sponsors
            </h2>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#2563eb] hover:text-[#1d4ed8] transition-colors group self-start sm:self-auto"
          >
            <Handshake className="w-4 h-4" />
            Become a Partner
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* Right-to-Left Infinite Running Strap Viewport */}
        <div className="relative w-full overflow-hidden py-1.5">
          {/* Edge Gradient Fades for Seamless Viewport Entrance/Exit */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#faf9f6] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#faf9f6] to-transparent z-10 pointer-events-none" />

          {/* Running Marquee Strap */}
          <div className="flex w-max will-change-transform animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
            {renderStrapItems('primary', false)}
            {renderStrapItems('duplicate', true)}
          </div>
        </div>

      </div>
    </section>
  )
}
