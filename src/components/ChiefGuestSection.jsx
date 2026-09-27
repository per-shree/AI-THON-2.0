import drLkGiteImg from '../assets/dr_lk_gite.png'

export default function ChiefGuestSection({ hideId = false }) {
  return (
    <section id={hideId ? undefined : 'chief-guest'} className="w-full bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-16 sm:scroll-mt-20">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <div className="w-full flex flex-col items-center justify-center text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#062b59]/5 border border-[#062b59]/15 text-[#062b59]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#062b59]">
              Grand Inauguration Ceremony
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#062b59] tracking-tight uppercase text-center">
            CHIEF GUEST OF THE EVENT
          </h2>

          <p 
            className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto text-center w-full"
            style={{ textAlign: 'center' }}
          >
            Presiding over the official opening ceremony and delivering the inaugural keynote address for AITHON 2.0.
          </p>
        </div>

        {/* Dignitary Showcase Card */}
        <div className="bg-white border border-[#e2d5c5] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column: Portrait */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-[240px] sm:max-w-[260px] p-2 bg-[#faf9f6] rounded-xl border border-[#edebe6] shadow-xs">
                  <img
                    src={drLkGiteImg}
                    alt="Dr. L. K. Gite - Scientist 'F', ARDE DRDO"
                    width="260"
                    height="325"
                    className="w-full aspect-[4/5] object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>

                <div className="mt-3 text-center">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-md">
                    ARDE Pune • DRDO
                  </span>
                </div>
              </div>

              {/* Right Column: Name, Titles, Bio & Engagements */}
              <div className="md:col-span-7 space-y-5 text-left">
                
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#062b59] leading-tight">
                    Dr. L. K. Gite
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-[#ea580c] mt-0.5">
                    Scientist
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                    Armament Research & Development Establishment (ARDE)
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Defence Research & Development Organisation (DRDO), Ministry of Defence
                  </p>
                </div>

                <div className="h-px bg-[#edebe6] w-full" />

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Dr. L. K. Gite is a senior defence scientist at ARDE Pune (DRDO) with extensive research leadership in advanced armament systems and defence technologies. He has been closely associated with leading scientific and engineering bodies, including the Aeronautical Society of India (AeSI) Pune Branch.
                </p>

                {/* Inauguration Highlights */}
                <div className="mt-4 sm:mt-5 space-y-2 bg-[#faf9f6] p-4 rounded-xl border border-[#edebe6] text-xs">
                  <p className="font-bold text-[#062b59] uppercase tracking-wider text-[11px]">
                    Inauguration Presence
                  </p>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#ea580c] font-black shrink-0">•</span>
                      <span><strong>Keynote Address:</strong> Delivering the opening keynote on technological innovation and research discipline.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ea580c] font-black shrink-0">•</span>
                      <span><strong>Hackathon Flag-off:</strong> Presiding over the ceremonial lamp lighting and officially launching the 12-hour hackathon.</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          </div>

          {/* Bottom Host Citation Bar */}
          <div className="bg-[#faf9f6] border-t border-[#edebe6] px-6 py-3 text-center text-xs text-slate-600 font-medium">
            Organized by the Department of Artificial Intelligence & Data Science, Amrutvahini College of Engineering, Sangamner
          </div>

        </div>

      </div>
    </section>
  )
}
