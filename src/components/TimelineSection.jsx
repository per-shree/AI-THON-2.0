export default function TimelineSection() {
  const steps = [
    { num: '01', title: 'REGISTRATION', desc: 'Online portal opens for team applications' },
    { num: '02', title: 'TEAM FORMATION', desc: 'Assemble 2–4 members & select track preference' },
    { num: '03', title: 'CHALLENGE REVEAL', desc: 'Detailed problem statements & track datasets released' },
    { num: '04', title: 'HACKATHON BEGINS', desc: '12-hour continuous development at AVCOE' },
    { num: '05', title: 'DEVELOPMENT', desc: 'Rapid prototyping, model training & software build' },
    { num: '06', title: 'MENTORSHIP', desc: 'Guidance & feedback rounds with expert mentors' },
    { num: '07', title: 'SUBMISSION', desc: 'Source code repository & live prototype submission' },
    { num: '08', title: 'EVALUATION', desc: 'Technical evaluation by independent jury panel' },
    { num: '09', title: 'FINAL PRESENTATION', desc: 'Top finalist teams pitch live to jury panel' },
    { num: '10', title: 'RESULTS', desc: 'Winner ceremony & prize distribution' },
  ]

  return (
    <section id="timeline" className="w-full bg-white py-20 lg:py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-bold text-[#2563eb] uppercase tracking-widest">
            EVENT STRUCTURE
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#062b59]">
            HACKATHON TIMELINE
          </h2>
          <p className="text-slate-600 text-base">
            Ten structured stages from initial team registration to winner announcements.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="bg-[#faf9f6] hover:bg-white p-6 rounded-xl border border-[#edebe6] hover:border-[#2563eb] transition-all shadow-xs space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#2563eb]">{s.num}</span>
                <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
              </div>
              <h3 className="text-sm font-extrabold text-[#062b59]">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
