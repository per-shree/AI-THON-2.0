import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  Mail,
  Copy,
  Check,
  X,
  Send,
  FileText,
  Clock,
} from 'lucide-react'

export default function NoticePopup() {
  const [isOpen, setIsOpen] = useState(true)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedFormat, setCopiedFormat] = useState(false)

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const targetEmail = 'shivaji.wathore@avcoe.org'

  const emailFormatText = `Team No. – (if not known kindly keep blank)
Team Name – 
Team Leader – 
Team leader email - 
Payment UTR No. – 
Payment Receipt – [Attach Payment Screenshot with UTR]
PPT – [Attach PPT file]`

  const mailtoSubject = encodeURIComponent('AiTHON 2.0 PPT Submission - [Your Team No. / Name]')
  const mailtoBody = encodeURIComponent(
    `Dear AiTHON 2.0 Organizing Committee,\n\nPlease find our Round 1 PPT submission details below:\n\nTeam No. – (if not known kindly keep blank)\nTeam Name – \nTeam Leader – \nTeam leader email - \nPayment UTR No. – \nPayment Receipt – [Attached Receipt/Screenshot with UTR]\nPPT – [Attached PPT File]\n\nThank you,\n[Team Leader Name]`
  )
  const mailtoUrl = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`

  const handleCopyEmail = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(targetEmail)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  const handleCopyFormat = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(emailFormatText)
    setCopiedFormat(true)
    setTimeout(() => setCopiedFormat(false), 2500)
  }

  return (
    <>
      {/* 1. Modal Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-popup-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn selection:bg-orange-500 selection:text-white"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-[94vw] sm:max-w-xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto animate-scaleIn text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Color Accent Strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-[#062b59] shrink-0" />

            {/* Header */}
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-gradient-to-b from-orange-50/50 to-white shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200/80">
                  <AlertTriangle className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
                      Important Announcement
                    </span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  </div>
                  <h2
                    id="notice-popup-title"
                    className="text-base sm:text-lg font-bold text-[#062b59] tracking-tight leading-snug"
                  >
                    Notice Regarding PPT Submission
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Announcement Modal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs sm:text-sm text-slate-700 leading-normal">
              
              {/* Regret Statement Banner */}
              <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-950 font-medium text-xs sm:text-[13px] flex items-center gap-2">
                <span className="text-amber-600 font-bold">⚠️</span>
                <span>We sincerely regret the inconvenience caused.</span>
              </div>

              {/* Main Explanation */}
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed pb-1.5 sm:pb-2">
                Due to the large number of registrations received for{' '}
                <strong className="text-[#062b59] font-bold">AiTHON 2.0</strong>, teams that
                have successfully made the <strong className="text-emerald-700 font-bold">₹50 payment</strong> can
                submit their PPT <strong className="text-orange-600 underline font-bold decoration-orange-400">via email only</strong>.
              </p>

              {/* High-Visibility Card: Deadline + Target Email */}
              <div className="bg-[#062b59] text-white p-3.5 sm:p-4 rounded-xl border border-[#1e3a8a] space-y-2.5 shadow-sm">
                
                {/* Deadline Row */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="text-blue-200 font-medium">Submission Deadline:</span>
                    <span className="font-bold text-white text-xs sm:text-sm">
                      Up to 12:00 Noon (05/10/2026)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white font-extrabold text-[10px] tracking-wider uppercase shrink-0">
                    05/10/2026 • 12 Noon
                  </span>
                </div>

                {/* Email Row & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                  <div className="min-w-0">
                    <div className="text-[11px] text-blue-200 font-medium flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span>Please send your PPT to:</span>
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wide select-all block mt-0.5">
                      {targetEmail}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#062b59] hover:bg-orange-50 text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>

                    <a
                      href={mailtoUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5 shrink-0" />
                      <span>Send Mail</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Mention The Following Details Card (Compact & Clean 2-column or list) */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 sm:p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-[13px] font-bold text-[#062b59] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    Mention the following details in the email:
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyFormat}
                    className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-600 hover:text-[#062b59] bg-white border border-slate-200 hover:border-slate-300 px-2 py-0.5 rounded-md transition-colors cursor-pointer shrink-0"
                    title="Copy format into clipboard"
                  >
                    {copiedFormat ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="text-emerald-700">Format Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>Copy Format</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Details Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs sm:text-[13px] text-slate-800">
                  <div className="flex items-center gap-2 py-1 px-1.5 sm:col-span-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span className="leading-snug">
                      <strong className="text-slate-900 font-semibold">Team No.</strong> –{' '}
                      <span className="text-[11px] sm:text-xs text-slate-500 font-normal italic">
                        (if not known kindly keep blank)
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 py-1 px-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span><strong className="text-slate-900 font-semibold">Team Name</strong> –</span>
                  </div>
                  <div className="flex items-center gap-2 py-1 px-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span><strong className="text-slate-900 font-semibold">Team Leader</strong> –</span>
                  </div>
                  <div className="flex items-center gap-2 py-1 px-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span><strong className="text-slate-900 font-semibold">Team leader email</strong> –</span>
                  </div>
                  <div className="flex items-center gap-2 py-1 px-1.5 sm:col-span-2 bg-blue-50/70 rounded-md border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span><strong className="text-slate-900 font-semibold">Payment Receipt with UTR</strong> – Attach receipt/screenshot showing UTR No.</span>
                  </div>
                  <div className="flex items-center gap-2 py-1 px-1.5 sm:col-span-2 bg-emerald-50/70 rounded-md border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span><strong className="text-slate-900 font-semibold">PPT</strong> – Attach the PPT file (.pptx or .pdf)</span>
                  </div>
                </div>
              </div>

              {/* Apology & Cooperation Note */}
              <p className="text-center text-xs text-slate-600 italic pt-0.5">
                &ldquo;We apologize for the inconvenience and appreciate your patience and cooperation.&rdquo;
              </p>

            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-500">
                Department of AI &amp; DS • AVCOE
              </span>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-[#062b59] hover:bg-[#2563eb] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
              >
                I Understand &amp; Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Action Pill to reopen anytime when dismissed */}
      {!isOpen && (
        <aside
          aria-label="Reopen PPT Submission Notice"
          className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 animate-fadeIn select-none"
        >
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 px-3.5 py-2 sm:py-2.5 bg-gradient-to-r from-[#062b59] to-[#0a3a75] hover:to-[#2563eb] text-white text-[11px] sm:text-xs font-bold rounded-full shadow-[0_8px_25px_rgba(6,43,89,0.3)] border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-orange-500" />
            </span>
            <span className="tracking-wide">PPT Submission Notice</span>
            <span className="bg-orange-500 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold group-hover:bg-white group-hover:text-[#062b59] transition-colors shrink-0">
              Till 12 Noon (05/10/2026)
            </span>
          </button>
        </aside>
      )}
    </>
  )
}
