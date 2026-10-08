import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Trophy, Mail, X, ArrowRight, CheckCircle2, Info, Sparkles } from 'lucide-react'

export default function GrandFinaleNoticeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Trigger popup when visitor arrives on the site
  useEffect(() => {
    if (location.pathname === '/') {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 250)
      return () => clearTimeout(timer)
    } else {
      setIsOpen(false)
    }
  }, [location.pathname])

  // Prevent background scrolling while popup is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow || 'unset'
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Allow closing via Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleDismiss = () => {
    setIsOpen(false)
  }

  const handleViewShortlist = () => {
    setIsOpen(false)
    if (location.pathname !== '/shortlisted-teams') {
      navigate('/shortlisted-teams')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* 1. Modal Dialog & Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 xs:p-3 sm:p-5 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
          onClick={handleDismiss}
          role="dialog"
          aria-modal="true"
          aria-labelledby="grand-finale-notice-title"
        >
          <div 
            className="relative w-full max-w-lg sm:max-w-xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 transition-all transform animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Decorative Gradient Accent Bar */}
            <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 shrink-0" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-2.5 right-2.5 xs:top-3 xs:right-3 sm:top-4 sm:right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer z-20"
              aria-label="Close Announcement"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Scrollable Modal Content */}
            <div className="p-3.5 xs:p-4 sm:p-6 md:p-7 overflow-y-auto space-y-3 sm:space-y-4 flex-1 overscroll-contain">
              
              {/* Top Eyebrow Badge & Heading */}
              <div className="pr-8 sm:pr-10">
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
                    <span>ROUND 1 RESULTS ANNOUNCED</span>
                  </span>
                </div>

                <h2 
                  id="grand-finale-notice-title"
                  className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black text-[#062b59] tracking-tight leading-snug"
                >
                  Results Are Announced!
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Round 1 idea evaluation is complete. Heartiest congratulations to all selected teams advancing to the continuous offline Grand Finale of <strong className="text-[#062b59]">AI-THON 2.0</strong>!
                </p>
              </div>

              {/* Instruction Card 1: Confirmation Mail, Details & Payment */}
              <div className="p-3 xs:p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/80 border border-blue-200/90 shadow-2xs">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#062b59] uppercase tracking-wide">
                      Confirmation Email &amp; Payment Process
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed">
                      All selected teams will receive an official confirmation email sent directly to the <strong className="text-[#062b59]">Team Leader&apos;s registered email address</strong>.
                    </p>
                    <div className="bg-white/90 border border-blue-100 rounded-xl p-2 sm:p-2.5 text-[10.5px] sm:text-xs text-slate-700 space-y-1">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>In that email, you must fill out your finalized team member details.</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Complete the official Grand Finale registration payment as instructed.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instruction Card 2: Note Regarding Team IDs on Receipts */}
              <div className="p-3 xs:p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/85 border border-amber-200/90 shadow-2xs">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-extrabold text-amber-900 uppercase tracking-wide">
                      Important Note: Team IDs on Receipts
                    </h3>
                    <p className="text-[11px] sm:text-xs text-amber-950/90 leading-relaxed">
                      Some teams may have received an incorrect or mismatched Team ID on their initial registration receipt/slip.
                    </p>
                    <div className="p-2 sm:p-2.5 rounded-xl bg-white/90 border border-amber-200/80 text-[10.5px] sm:text-xs text-slate-700 leading-relaxed space-y-1">
                      <p>
                        <strong className="text-emerald-700 font-bold">Please do not panic:</strong> Your official and correct Team ID is the one sent in your <strong className="text-[#062b59]">verification email</strong> and listed on the official shortlisted teams page.
                      </p>
                      <p className="text-slate-500 font-medium">
                        Your registration and shortlist status are 100% verified. We kindly request participants not to disturb or call the organizing committee regarding receipt ID numbers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Action Footer Bar (Pinned at bottom, side-by-side on mobile to save vertical space) */}
            <div className="p-2.5 xs:p-3 sm:p-4 bg-slate-50/95 border-t border-slate-100 shrink-0 flex flex-row items-center justify-between sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleDismiss}
                className="flex-1 sm:flex-none py-2 xs:py-2.5 px-3 sm:px-5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors text-center cursor-pointer whitespace-nowrap"
              >
                I Understand
              </button>

              <button
                type="button"
                onClick={handleViewShortlist}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2 xs:py-2.5 px-3 sm:px-5 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 text-center cursor-pointer whitespace-nowrap"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>View Shortlist</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 hidden xs:inline-block" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Reopen Trigger Pill (When closed) */}
      {!isOpen && location.pathname === '/' && (
        <aside
          aria-label="Round 1 Results Announcement Notice"
          className="no-print fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-40 animate-fadeIn select-none"
        >
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3 xs:px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md text-[#062b59] border-2 border-[#2563eb]/70 shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            title="Open Grand Finale Results Notice"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563eb]"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#062b59]">
              Results Notice
            </span>
          </button>
        </aside>
      )}
    </>
  )
}
