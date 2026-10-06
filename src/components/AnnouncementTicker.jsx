import { IS_REGISTRATION_CLOSED } from '../config/registrationConfig'

export default function AnnouncementTicker() {
  const announcements = [
    'AITHON 2.0',
    'IMPORTANT NOTICE: TEAMS WITH ₹50 PAYMENT CAN SUBMIT PPT & PAYMENT RECEIPT WITH UTR VIA EMAIL TO SHIVAJI.WATHORE@AVCOE.ORG UP TO 12:00 NOON (05/10/2026)',
    IS_REGISTRATION_CLOSED
      ? '⚠️ REGISTRATIONS FOR AI-THON 2.0 ARE OFFICIALLY CLOSED • SHORTLISTING IN PROGRESS'
      : 'REGISTRATIONS ACCEPTED TILL 04 OCT 2026',
    IS_REGISTRATION_CLOSED
      ? 'ROUND 1 IDEA EVALUATION UNDERWAY'
      : 'ROUND 1 IDEA PPT SUBMISSION OPEN',
    'CHIEF GUEST (INAUGURATION): DR. L. K. GITE (SCIENTIST "F" - ARDE PUNE, DRDO)',
    'OFFICIAL TITLE SPONSOR: SUMAGO INFOTECH',
    'OFFICIAL PLATINUM SPONSOR: DASS CHEMTECH',
    'OFFICIAL GOLD SPONSOR: OAKYA IT SERVICES',
    'OFFICIAL SILVER SPONSOR: INVOFIX',
    'GRAND FINALE: 23 OCTOBER 2026',
    '12 HOURS NON-STOP HACKATHON',
    'TOTAL PRIZE POOL ₹1,00,000 (WINNER ₹40K • 1ST RUNNER UP ₹30K • 2ND RUNNER UP ₹20K • 3RD RUNNER UP ₹6K • 4TH RUNNER UP ₹4K)',
    'WINNER PRIZE WORTH ₹1,60,000 (40,000 CASH + 1.20 LAKH INTERNSHIP + TROPHY + T-SHIRTS)',
    'SURPRISE GIFTS FOR ALL TOP 20 FINALISTS WORTH ₹30,000',
  ]

  const renderItemBlock = (keyPrefix = 'b1', isAriaHidden = false) => (
    <div className="flex items-center shrink-0" aria-hidden={isAriaHidden}>
      {announcements.map((item, idx) => (
        <div key={`${keyPrefix}-${idx}`} className="flex items-center">
          <span className="text-xs font-semibold text-white tracking-wide uppercase whitespace-nowrap">
            {item}
          </span>
          <span className="mx-6 text-[#60a5fa] font-bold select-none">•</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="w-full bg-[#062b59] overflow-hidden flex items-center h-10 border-b border-[#1e3a8a]/50 relative z-20 select-none">
      {/* Static Announcements Header Badge */}
      <div className="bg-[#ea580c] text-white text-[10px] font-bold uppercase tracking-widest px-4 flex-shrink-0 z-20 flex items-center h-full shadow-sm">
        ANNOUNCEMENTS
      </div>
      
      {/* Marquee Viewport with Edge Fade Masks */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        {/* Soft edge gradient masks for smooth entry/exit */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#062b59] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#062b59] to-transparent z-10 pointer-events-none" />

        {/* Dual-block seamless continuous ticker with mathematically uniform spacing */}
        <div className="announcement-marquee cursor-default">
          {renderItemBlock('primary', false)}
          {renderItemBlock('duplicate', true)}
        </div>
      </div>
    </div>
  )
}
