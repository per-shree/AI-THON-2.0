import { ExternalLink, Handshake } from 'lucide-react'

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
    <div className="flex items-center gap-5 shrink-0 pr-5" aria-hidden={isAriaHidden}>
      {sponsors.map((item, idx) => {
        const hasValidLink = item.url && item.url !== '#'

        if (item.isActive && hasValidLink) {
          return (
            <a
              key={`${keyPrefix}-${idx}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white border border-[#edebe6] hover:border-blue-500 rounded-2xl px-4 py-3 flex items-center gap-4 shadow-xs hover:shadow-md transition-all duration-300 shrink-0 w-80 sm:w-88 cursor-pointer"
            >
              {/* Logo Box */}
              <div
                className={`w-20 h-16 sm:w-24 sm:h-16 rounded-xl ${
                  item.isFullBox
                    ? 'bg-black border border-slate-900'
                    : 'bg-slate-50 border border-slate-100 p-2'
                } flex items-center justify-center shrink-0 group-hover:bg-blue-50/50 transition-colors overflow-hidden`}
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  className={
                    item.isFullBox
                      ? 'w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300'
                      : item.isLargeLogo
                      ? 'max-h-12 max-w-full object-contain group-hover:scale-105 transition-transform duration-300'
                      : 'max-h-10 max-w-full object-contain group-hover:scale-105 transition-transform duration-300'
                  }
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider text-[#062b59] bg-[#f5ede4] border border-[#e2d5c5] leading-tight">
                  {item.tier}
                </span>
                <h3 className="text-sm font-bold text-[#062b59] group-hover:text-blue-600 transition-colors truncate mt-1">
                  {item.name}
                </h3>
                <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>

              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1" />
            </a>
          )
        }

        if (item.isActive && !hasValidLink) {
          return (
            <div
              key={`${keyPrefix}-${idx}`}
              className="group relative bg-white border border-[#edebe6] rounded-2xl px-4 py-3 flex items-center gap-4 shadow-xs shrink-0 w-80 sm:w-88 cursor-default"
            >
              {/* Logo Box */}
              <div
                className={`w-20 h-16 sm:w-24 sm:h-16 rounded-xl ${
                  item.isFullBox
                    ? 'bg-black border border-slate-900'
                    : 'bg-slate-50 border border-slate-100 p-2'
                } flex items-center justify-center shrink-0 overflow-hidden`}
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  className={
                    item.isFullBox
                      ? 'w-full h-full object-contain p-1'
                      : item.isLargeLogo
                      ? 'max-h-12 max-w-full object-contain'
                      : 'max-h-10 max-w-full object-contain'
                  }
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider text-[#062b59] bg-[#f5ede4] border border-[#e2d5c5] leading-tight">
                  {item.tier}
                </span>
                <h3 className="text-sm font-bold text-[#062b59] truncate mt-1">
                  {item.name}
                </h3>
                <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          )
        }

        return (
          <div
            key={`${keyPrefix}-${idx}`}
            className="bg-white/80 border border-dashed border-[#edebe6] rounded-2xl px-4 py-3 flex items-center gap-4 shrink-0 w-72 sm:w-80"
          >
            <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200/70 leading-tight">
                {item.tier}
              </span>
              <h3 className="text-sm font-bold text-[#062b59]/80 truncate mt-1">
                {item.desc}
              </h3>
              <p className="text-xs font-medium text-slate-400 truncate mt-0.5">
                {item.name}
              </p>
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
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-3 border-b border-[#edebe6]">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-black text-[#062b59] tracking-tight uppercase">
              PARTNERS & SUPPORTERS
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              Our Official Sponsors
            </p>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#062b59] bg-[#f5ede4] hover:bg-[#ede3d5] border border-[#e2d5c5] transition-all group self-start sm:self-auto shadow-2xs"
          >
            <Handshake className="w-4 h-4 text-[#ea580c] shrink-0" />
            <span>Become a Partner</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* Right-to-Left Infinite Running Strap Viewport */}
        <div className="relative w-full overflow-hidden py-1">
          {/* Edge Gradient Fades for Seamless Viewport Entrance/Exit */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#faf9f6] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#faf9f6] to-transparent z-10 pointer-events-none" />

          {/* Running Marquee Strap */}
          <div className="sponsor-marquee">
            {renderStrapItems('primary', false)}
            {renderStrapItems('duplicate', true)}
          </div>
        </div>

      </div>
    </section>
  )
}
