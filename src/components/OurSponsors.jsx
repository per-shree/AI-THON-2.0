import { ExternalLink, Sparkles, Trophy } from 'lucide-react'

const titleSponsor = {
  name: 'Sumago Infotech Pvt. Ltd.',
  logo: '/sumago_logo.png',
  url: 'https://sumagoinfotech.com/',
  role: 'TITLE SPONSOR',
  tagline: 'Premier Software Development & IT Consulting Leader',
  desc: 'Proud Title Sponsor of AITHON 2.0 — Driving technological innovation, mentoring emerging engineering talent, and empowering next-generation AI solutions.',
}

const partnersList = [
  {
    name: 'NEXA (Mahalaxmi Automotives)',
    logo: '/nexa_logo.png',
    url: 'https://www.nexaexperience.com/',
    role: 'Official Automotive Partner',
    desc: 'Mahalaxmi Automotives, Sangamner — delivering premium luxury automotive experiences.',
    isDarkBg: true,
  },
  {
    name: 'Dainik Yuvavarta',
    logo: '/yuvavarta_logo.png',
    url: '',
    role: 'Official Media Partner',
    desc: 'Leading regional daily newspaper delivering trusted journalism and extensive media coverage.',
  },
  {
    name: '.XYZ Domains',
    logo: '/xyz_logo.png',
    url: 'https://gen.xyz',
    role: 'Official Domain Partner',
    desc: 'Empowering next-generation innovators and tech creators with global top-level domains.',
  },
  {
    name: 'Bijankur Real Estate & Developers',
    logo: '/bijankur_logo.png',
    url: '',
    role: 'Real Estate & Developers',
    desc: 'Leading infrastructure and premier real estate developers committed to regional development.',
  },
  {
    name: 'Vajra Infra',
    logo: '/vajra_logo.png',
    url: '',
    role: 'Real Estate & Developers',
    desc: 'Strength, Build, Infrastructure — Delivering excellence in infrastructure and engineering development.',
  },
  {
    name: 'Unitech Institute Sangamner',
    logo: '/unitech_logo.png',
    url: '',
    role: 'ASSOCIATE PARTNER',
    desc: 'Premier computer education, technical training, and skill development institute in Sangamner.',
  },
  {
    name: 'Qwicit Technologies',
    logo: '/qwicit_logo.png',
    url: 'https://qwicit.com/',
    role: 'Technology & Payment Gateway Partner',
    desc: "There's no limit to ideas.! — Powering digital solutions and seamless payment gateway infrastructure for AITHON 2.0.",
  },
  {
    name: 'Shravya Studios',
    logo: '/shravya_logo.png',
    url: 'https://shravyastudios.com/',
    role: 'ASSOCIATE PARTNER',
    desc: 'Creative media production, premium visual storytelling, and digital studio solutions.',
    isDarkBg: true,
  },
]

export default function OurSponsors() {
  return (
    <section id="our-sponsors" className="w-full bg-[#faf9f6] pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#2563eb]">
              OUR SPONSORS
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#062b59] tracking-tight uppercase">
            OUR OFFICIAL SPONSORS & PARTNERS
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-2xl mx-auto">
            Proudly supported by visionary industry leaders and technology partners powering AITHON 2.0.
          </p>
        </div>

        {/* Featured Title Sponsor Spotlight Card */}
        <div className="mb-12 sm:mb-16 max-w-4xl mx-auto">
          <div className="text-center mb-3.5">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] text-amber-800 bg-amber-100/90 border border-amber-300/90 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>TITLE SPONSOR SPOTLIGHT</span>
            </span>
          </div>

          <a
            href={titleSponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block bg-gradient-to-b from-white via-[#fffdfa] to-amber-50/25 border-2 border-amber-300 hover:border-amber-400 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_10px_35px_rgba(245,158,11,0.09)] hover:shadow-[0_20px_50px_rgba(245,158,11,0.18)] transition-all duration-300 overflow-hidden cursor-pointer text-center"
          >
            {/* Top Amber-to-Orange Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-[#2563eb]" />

            {/* Subtle Golden Glow Accents */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
              {/* Official Title Sponsor Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 sm:mb-5 text-amber-900 bg-amber-100 border border-amber-300 shadow-2xs">
                <Trophy className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>OFFICIAL TITLE SPONSOR</span>
              </div>

              {/* Grand Wide Logo Frame - Perfectly Sized for High-Res Logo */}
              <div className="w-full max-w-lg bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-7 shadow-2xs group-hover:bg-amber-50/30 group-hover:border-amber-300 transition-all duration-300 mb-5 flex items-center justify-center">
                <img
                  src={titleSponsor.logo}
                  alt={titleSponsor.name}
                  className="h-11 xs:h-13 sm:h-16 md:h-20 w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                />
              </div>

              {/* Title Sponsor Headline */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#062b59] group-hover:text-[#2563eb] transition-colors tracking-tight mb-2">
                {titleSponsor.name}
              </h3>

              <p className="text-xs sm:text-sm md:text-base font-bold text-[#ea580c] mb-3">
                {titleSponsor.tagline}
              </p>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-5 max-w-xl">
                {titleSponsor.desc}
              </p>

              {/* Domain Badges / Capabilities */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#f5ede4] text-[#062b59] border border-[#e2d5c5]">
                  Software Development
                </span>
                <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#f5ede4] text-[#062b59] border border-[#e2d5c5]">
                  IT Consulting
                </span>
                <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#f5ede4] text-[#062b59] border border-[#e2d5c5]">
                  AI & Cloud Solutions
                </span>
                <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#f5ede4] text-[#062b59] border border-[#e2d5c5]">
                  Innovation Partner
                </span>
              </div>

              {/* CTA Button */}
              <span className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#062b59] to-[#0b3b75] text-white font-bold text-xs sm:text-sm uppercase tracking-wider group-hover:from-[#2563eb] group-hover:to-blue-700 transition-all shadow-xs group-hover:shadow-md group-hover:-translate-y-0.5">
                <span>Visit Official Website</span>
                <ExternalLink className="w-4 h-4" />
              </span>
            </div>
          </a>
        </div>

        {/* Section Subtitle for Co-Sponsors & Partners */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="h-px w-8 sm:w-12 bg-slate-300" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
              ASSOCIATE SPONSORS & OFFICIAL PARTNERS
            </span>
            <div className="h-px w-8 sm:w-12 bg-slate-300" />
          </div>
        </div>

        {/* Proper Static Sponsor Cards Grid (Balanced 4x2 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {partnersList.map((sponsor) => {
            const hasLink = Boolean(sponsor.url)
            const CardWrapper = hasLink ? 'a' : 'div'
            const wrapperProps = hasLink
              ? {
                  href: sponsor.url,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }
              : {}

            return (
              <CardWrapper
                key={sponsor.name}
                {...wrapperProps}
                className={`group bg-white border border-[#edebe6] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden text-center ${
                  hasLink
                    ? 'hover:border-blue-400 hover:-translate-y-1 cursor-pointer'
                    : 'hover:border-slate-300 cursor-default'
                }`}
              >
                {/* Subtle Top Gradient Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#062b59] via-[#2563eb] to-[#ea580c] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Logo Container */}
                  <div
                    className={`w-full h-24 sm:h-28 rounded-xl flex items-center justify-center p-3 mb-4 overflow-hidden transition-colors ${
                      sponsor.isDarkBg
                        ? 'bg-black border border-slate-900'
                        : 'bg-slate-50 border border-slate-100 group-hover:bg-slate-100/70'
                    }`}
                  >
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Role Badge */}
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 text-[#062b59] bg-[#f5ede4] border border-[#e2d5c5]">
                    {sponsor.role}
                  </div>

                  {/* Sponsor Name */}
                  <h3 className="text-sm sm:text-base font-extrabold text-[#062b59] group-hover:text-[#2563eb] transition-colors leading-snug mb-2">
                    {sponsor.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                    {sponsor.desc}
                  </p>
                </div>

                {/* Footer Link / Info */}
                <div className="pt-3 border-t border-slate-100 w-full flex items-center justify-center">
                  {hasLink ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] group-hover:text-[#062b59] transition-colors">
                      <span>Visit Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <span>Official Partner</span>
                    </span>
                  )}
                </div>
              </CardWrapper>
            )
          })}
        </div>

      </div>
    </section>
  )
}
