import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Trophy, Mail, X, ArrowRight, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react'

export default function GrandFinaleNoticeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Trigger popup every time the user visits the home page
  useEffect(() => {
    if (location.pathname === '/') {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 350)
      return () => clearTimeout(timer)
    } else {
      setIsOpen(false)
    }
  }, [location.pathname])

  // Prevent background scrolling while popup is open
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

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="grand-finale-notice-title"
    >
      <div 
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 transition-all transform scale-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Gradient Accent Bar */}
        <div className="h-2.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 shrink-0" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer z-10"
          aria-label="Close Announcement"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4">
          
          {/* Top Eyebrow Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>ROUND 1 RESULTS ANNOUNCED</span>
            </span>
          </div>

          {/* Heading */}
          <div>
            <h2 
              id="grand-finale-notice-title"
              className="text-xl sm:text-2xl md:text-3xl font-black text-[#062b59] tracking-tight leading-snug"
            >
              Results Are Announced!
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Round 1 idea evaluation is complete. Heartiest congratulations to all selected teams advancing to the continuous offline Grand Finale of <strong className="text-[#062b59]">AI-THON 2.0</strong>!
            </p>
          </div>

          {/* Instruction Card 1: Confirmation Mail, Details & Payment */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/80 border border-blue-200/90 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-xs sm:text-sm font-extrabold text-[#062b59] uppercase tracking-wide">
                  Confirmation Email &amp; Payment Process
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  All selected teams will receive an official confirmation email sent directly to the <strong className="text-[#062b59]">Team Leader&apos;s registered email address</strong>.
                </p>
                <div className="bg-white/80 border border-blue-100 rounded-xl p-2.5 text-[11.5px] sm:text-xs text-slate-700 space-y-1">
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
          <div className="p-4 rounded-2xl bg-amber-50/85 border border-amber-200/90 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-amber-900 uppercase tracking-wide">
                    Important Note: Team IDs on Receipts
                  </h3>
                </div>
                <p className="text-xs text-amber-950/90 leading-relaxed">
                  Some teams may have received an incorrect or mismatched Team ID on their initial registration receipt/slip.
                </p>
                <div className="p-2.5 rounded-xl bg-white/90 border border-amber-200/80 text-[11px] sm:text-xs text-slate-700 leading-relaxed space-y-1">
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

          {/* Modal Action Buttons */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors text-center cursor-pointer"
            >
              I Understand
            </button>

            <button
              type="button"
              onClick={handleViewShortlist}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 text-center cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>View Shortlisted Teams</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
