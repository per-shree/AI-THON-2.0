export default function ProblemStatements() {
  const domains = [
    { title: 'AI in Healthcare & Medicine', tag: 'Track 01' },
    { title: 'AI in Dental Science & Diagnostics', tag: 'Track 02' },
    { title: 'AI in Pharmacy & Drug Discovery', tag: 'Track 03' },
    { title: 'LegalTech, AI Ethics & Law', tag: 'Track 04' },
    { title: 'FinTech & Financial Intelligence', tag: 'Track 05' },
    { title: 'EdTech & Smart Learning', tag: 'Track 06' },
    { title: 'AI in Film, Animation & Storytelling', tag: 'Track 07' },
    { title: 'UI/UX & Accessible Design', tag: 'Track 08' },
    { title: 'Industrial Automation & Robotics', tag: 'Track 09' },
    { title: 'Smart Energy & CleanTech', tag: 'Track 10' },
    { title: 'Aerospace, Telemetry & SpaceTech', tag: 'Track 11' },
    { title: 'AgriTech & Smart Farming', tag: 'Track 12' },
    { title: 'Environmental AI & Sustainability', tag: 'Track 13' },
    { title: 'E-Commerce & Retail Automation', tag: 'Track 14' },
    { title: 'Supply Chain & Logistics Intelligence', tag: 'Track 15' },
    { title: 'Cybersecurity, Forensics & Cyber Law', tag: 'Track 16' },
    { title: 'Smart Cities & Urban Mobility', tag: 'Track 17' },
    { title: 'Disaster Management & Public Safety', tag: 'Track 18' },
    { title: 'Mental Health & Psychology AI', tag: 'Track 19' },
    { title: 'Sports Analytics & Performance Tech', tag: 'Track 20' },
    { title: 'Hospitality, Tourism & Service AI', tag: 'Track 21' },
    { title: 'Social Good & Civic Innovation', tag: 'Track 22' },
    { title: 'Open Innovation (Unrestricted Domain)', tag: 'Track 23' },
  ]

  return (
    <section className="bg-white py-16 lg:py-24 px-6 md:px-12 lg:px-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <p className="text-xs font-extrabold text-[#2563eb] uppercase tracking-widest">
            COMPETITION TRACKS & DOMAINS
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#062b59] tracking-tight leading-tight">
            PROBLEM STATEMENTS & TRACKS
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium pt-1">
            AITHON 2.0 features 23 diverse competition tracks. Teams can choose any domain aligned with their innovative ideas and technical expertise.
          </p>
        </div>

        {/* Problem Statement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full mb-12">
          {domains.map((item, idx) => (
            <div 
              key={idx}
              className="bg-[#faf9f6] border border-[#edebe6] p-5 flex flex-col justify-between text-left group hover:bg-white hover:border-[#2563eb] hover:shadow-sm transition-all duration-200 rounded-xl space-y-3"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-[#2563eb] text-[11px] font-extrabold tracking-wider uppercase border border-blue-100/80">
                  {item.tag}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#062b59] leading-snug group-hover:text-[#2563eb] transition-colors mt-2.5">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <a 
          href="#guidelines"
          className="bg-[#faf9f6] hover:bg-[#062b59] text-[#062b59] hover:text-white border-2 border-[#062b59] px-8 py-4 font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-lg shadow-xs"
        >
          VIEW ELIGIBILITY & GUIDELINES
        </a>
      </div>
    </section>
  )
}

