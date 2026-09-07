export default function TracksSection() {
  const tracks = [
    { num: '01', name: 'AI in Healthcare & Medicine' },
    { num: '02', name: 'AI in Dental Science & Diagnostics' },
    { num: '03', name: 'AI in Pharmacy & Drug Discovery' },
    { num: '04', name: 'LegalTech, AI Ethics & Law' },
    { num: '05', name: 'FinTech & Financial Intelligence' },
    { num: '06', name: 'EdTech & Smart Learning' },
    { num: '07', name: 'AI in Film, Animation & Storytelling' },
    { num: '08', name: 'UI/UX & Accessible Design' },
    { num: '09', name: 'Industrial Automation & Robotics' },
    { num: '10', name: 'Smart Energy & CleanTech' },
    { num: '11', name: 'Aerospace, Telemetry & SpaceTech' },
    { num: '12', name: 'AgriTech & Smart Farming' },
    { num: '13', name: 'Environmental AI & Sustainability' },
    { num: '14', name: 'E-Commerce & Retail Automation' },
    { num: '15', name: 'Supply Chain & Logistics Intelligence' },
    { num: '16', name: 'Cybersecurity, Forensics & Cyber Law' },
    { num: '17', name: 'Smart Cities & Urban Mobility' },
    { num: '18', name: 'Disaster Management & Public Safety' },
    { num: '19', name: 'Mental Health & Psychology AI' },
    { num: '20', name: 'Sports Analytics & Performance Tech' },
    { num: '21', name: 'Hospitality, Tourism & Service AI' },
    { num: '22', name: 'Social Good & Civic Innovation' },
    { num: '23', name: 'Open Innovation (Unrestricted Domain)' },
  ]

  return (
    <section id="tracks" className="w-full bg-white py-16 lg:py-24 px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-bold text-[#2563eb] uppercase tracking-widest">
            COMPETITION DOMAINS
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#062b59]">
            HACKATHON TRACKS
          </h2>
          <p className="text-slate-600 text-base">
            23 focused domains designed for targeted technological innovation.
          </p>
        </div>

        {/* Clean Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {tracks.map((t) => (
            <div key={t.num} className="space-y-2 pt-4 border-t-2 border-slate-200 hover:border-[#2563eb] transition-colors">
              <span className="text-xs font-extrabold text-[#2563eb] block uppercase tracking-wider">{t.num}</span>
              <h3 className="text-sm sm:text-base font-extrabold text-[#062b59] leading-snug tracking-tight">{t.name}</h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
