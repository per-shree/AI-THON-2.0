export default function EventStats() {
  return (
    <section className="w-full bg-slate-50 border-b border-slate-200 py-6 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-sm font-bold text-[#062b59]">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-normal text-xs">DATE:</span>
            <span>16 OCTOBER 2026</span>
          </div>

          <span className="hidden md:inline text-slate-300">|</span>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-normal text-xs">DURATION:</span>
            <span>12 HOURS</span>
          </div>

          <span className="hidden md:inline text-slate-300">|</span>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-normal text-xs">ELIGIBILITY:</span>
            <span className="text-[#2563eb]">OPEN FOR ALL</span>
          </div>

          <span className="hidden md:inline text-slate-300">|</span>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-normal text-xs">VENUE:</span>
            <span>AVCOE, SANGAMNER</span>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Amrutvahini College of Engineering
        </div>

      </div>
    </section>
  )
}
