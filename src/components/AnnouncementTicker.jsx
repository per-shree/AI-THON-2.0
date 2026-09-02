export default function AnnouncementTicker() {
  const announcements = [
    'AITHON 2.0',
    '9 OCTOBER 2026',
    '12 HOURS NON-STOP',
    'NATIONAL LEVEL AI HACKATHON',
    'AVCOE SANGAMNER',
    'REGISTRATIONS OPEN NOW',
    'TOTAL PRIZE POOL ₹1,00,000',
  ]

  const tickerText = announcements.join(' • ')

  return (
    <div className="w-full bg-[#062b59] overflow-hidden flex items-center h-10 border-b border-[#1e3a8a]/40 relative z-20 select-none">
      {/* Static Announcements Header Badge */}
      <div className="bg-[#ea580c] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 flex-shrink-0 z-20 flex items-center h-full shadow-sm">
        ANNOUNCEMENTS
      </div>
      
      {/* Marquee Viewport with Soft Edge Fade */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        {/* Soft edge gradient masks for smooth entry/exit */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#062b59] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#062b59] to-transparent z-10 pointer-events-none" />

        {/* Dual-block seamless continuous ticker */}
        <div className="flex w-max will-change-transform animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] cursor-default">
          {/* Block 1 */}
          <div className="flex items-center shrink-0 pr-8">
            <span className="text-xs font-medium text-white tracking-wide">
              {tickerText}
            </span>
            <span className="mx-8 text-white/40">•</span>
          </div>

          {/* Block 2 (Duplicate for flawless infinite loop with zero jump) */}
          <div className="flex items-center shrink-0 pr-8" aria-hidden="true">
            <span className="text-xs font-medium text-white tracking-wide">
              {tickerText}
            </span>
            <span className="mx-8 text-white/40">•</span>
          </div>
        </div>
      </div>
    </div>
  )
}
