export default function TimelineSection() {
  const steps = [
    {
      num: '01',
      stage: 'ROUND 1: QUALIFIER',
      title: 'ONLINE REGISTRATION',
      desc: 'Team Lead registers on the portal, enters details for 4–6 members, and selects 1 of 23 tracks. Registrations accepted till 04/10/2026 (11:59 PM IST).',
    },
    {
      num: '02',
      stage: 'ROUND 1: QUALIFIER',
      title: 'IDEA PPT SUBMISSION',
      desc: 'Download the official AITHON PPT template, upload the proposal presentation, and pay the ₹50 team evaluation fee.',
    },
    {
      num: '03',
      stage: 'ROUND 1: QUALIFIER',
      title: 'ROUND 1 EVALUATION',
      desc: 'Expert jury evaluates all submitted presentations based on innovation, technical complexity, and feasibility.',
    },
    {
      num: '04',
      stage: 'SHORTLISTING',
      title: 'SHORTLIST ANNOUNCEMENT',
      desc: 'Top finalist teams are officially selected and notified via acceptance emails with their unique Team ID.',
    },
    {
      num: '05',
      stage: 'SHORTLISTING',
      title: 'FINALE CONFIRMATION',
      desc: 'Finalists confirm their on-campus workstation and participation by paying the Grand Finale fee (₹200 per member).',
    },
    {
      num: '06',
      stage: 'ROUND 2: GRAND FINALE',
      title: 'CAMPUS REPORTING & KICKOFF',
      desc: 'Physical check-in at AVCOE Sangamner campus, ID verification, hack kits collection, and opening ceremony.',
    },
    {
      num: '07',
      stage: 'ROUND 2: GRAND FINALE',
      title: '12-HOUR HACKATHON',
      desc: 'Intensive 12-hour continuous offline development sprint with interactive mentorship checkpoints.',
    },
    {
      num: '08',
      stage: 'ROUND 2: GRAND FINALE',
      title: 'CODE SUBMISSION & PITCH',
      desc: 'GitHub repo push, live prototype execution, and direct pitch presentation to the industrial jury panel.',
    },
    {
      num: '09',
      stage: 'GRAND VALEDICTORY',
      title: 'AWARDS & FELICITATION',
      desc: 'Grand valedictory ceremony, track & grand winners announcement, trophy presentation, and cash prize distribution.',
    },
  ]

  return (
    <section id="timeline" className="w-full bg-white py-16 sm:py-20 lg:py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#2563eb]">
              EVENT STRUCTURE & ROADMAP
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#062b59] tracking-tight">
            HACKATHON TIMELINE
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Nine structured phases from online registration and PPT screening to the 12-hour offline Grand Finale at AVCOE.
          </p>
        </div>

        {/* Clean Balanced 3x3 Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="group bg-[#faf9f6] hover:bg-white p-6 rounded-2xl border border-[#edebe6] hover:border-[#2563eb] hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#2563eb] tracking-wider">
                    STEP {s.num}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#e2d5c5] text-[#062b59] group-hover:border-blue-200 group-hover:bg-blue-50/50 transition-colors">
                    {s.stage}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-[#062b59] group-hover:text-[#2563eb] transition-colors leading-snug">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {s.desc}
                </p>
              </div>

              {/* Bottom Subtle Bar Indicator */}
              <div className="w-full h-1 bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-[#062b59] group-hover:to-[#2563eb] rounded-full transition-all duration-300" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
