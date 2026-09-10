import { ExternalLink } from 'lucide-react'

const sponsorsList = [
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
    name: 'Pravara Infotech',
    logo: '/pravara_logo.png',
    url: 'https://pravarainfotech.in/',
    role: 'IT Solutions Partner',
    desc: 'End-to-end enterprise software engineering, scalable cloud solutions, and IT consulting.',
  },
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
]

export default function OurSponsors() {
  return (
    <section id="our-sponsors" className="w-full bg-[#faf9f6] pt-4 sm:pt-6 lg:pt-8 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2">
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

        {/* Proper Static Sponsor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
          {sponsorsList.map((sponsor) => {
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
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50/90 text-[#062b59] border border-blue-100 mb-2">
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
