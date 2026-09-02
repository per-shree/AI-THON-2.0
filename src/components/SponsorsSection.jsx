export default function SponsorsSection() {
  const sponsors = [
    { tier: 'TITLE SPONSOR', placeholder: 'TITLE LOGO' },
    { tier: 'POWERED BY', placeholder: 'POWERED LOGO' },
    { tier: 'ASSOCIATE PARTNER', placeholder: 'ASSOCIATE LOGO' },
    { tier: 'COMMUNITY PARTNER', placeholder: 'COMMUNITY LOGO' },
  ]

  return (
    <section className="w-full bg-white py-16 lg:py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16 flex flex-col items-center">
        
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#062b59] tracking-tight">
            OUR SPONSORS
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Supported by industry leaders and community organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {sponsors.map((sponsor) => (
            <div key={sponsor.tier} className="flex flex-col items-center space-y-6">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">
                {sponsor.tier}
              </span>
              <div className="w-full max-w-[200px] aspect-[3/2] border-2 border-[#edebe6] bg-[#faf9f6] rounded-xl flex items-center justify-center opacity-80 hover:opacity-100 hover:border-[#2563eb] transition-all duration-300">
                <span className="text-slate-400 font-semibold tracking-wider text-sm">
                  {sponsor.placeholder}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#edebe6] text-center">
          <p className="text-xs text-slate-500 mb-4">Interested in sponsoring AITHON 2.0?</p>
          <a
            href="#contact"
            className="inline-block px-6 py-2.5 rounded bg-[#062b59] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            BECOME A SPONSOR
          </a>
        </div>

      </div>
    </section>
  )
}
