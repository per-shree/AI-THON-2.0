import React, { useState, useEffect } from 'react'
import {
  Phone,
  Mail,
  X,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Headphones,
  Sparkles,
} from 'lucide-react'

// WhatsApp SVG Icon
function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2C6.496 2 2 6.496 2 12.031c0 1.97.57 3.81 1.554 5.37L2 22l4.757-1.523c1.508.922 3.28 1.453 5.274 1.453 5.535 0 10.031-4.496 10.031-10.031S17.566 2 12.031 2zm5.82 14.164c-.242.684-1.398 1.309-1.945 1.36-.547.05-1.25.07-3.957-1.047-3.46-1.426-5.69-4.945-5.86-5.172-.172-.227-1.387-1.848-1.387-3.523 0-1.676.875-2.504 1.188-2.848.312-.344.68-.43 1.055-.43.125 0 .234.008.336.016.297.016.445.039.64.508.243.586.83 2.023.903 2.172.07.148.117.32.023.508-.093.187-.14.304-.28.468-.14.164-.297.367-.422.492-.14.14-.289.297-.125.578.164.281.727 1.195 1.562 1.937 1.074.953 1.98 1.25 2.261 1.39.282.14.446.117.61-.07.164-.188.703-.82.89-1.102.188-.281.375-.234.633-.14.258.093 1.637.773 1.918.914.281.14.469.21.539.328.07.117.07.68-.172 1.364z" />
    </svg>
  )
}

export const SUPPORT_CONTACTS = [
  {
    name: 'Vedant J. Mande',
    role: 'President & Core Organizer',
    tag: 'Lead Coordinator & Event Head',
    phone: '+918591910018',
    phoneDisplay: '+91 85919 10018',
    email: 'work.vedantmande@gmail.com',
    initials: 'VM',
    avatarBg: 'bg-indigo-600',
    whatsappMessage: 'Hello Vedant, I need assistance with Ai-THON 2.0 registration and coordination.',
  },
  {
    name: 'Sudhanshu M. Rahane',
    role: 'Technical Head & Core Organizer',
    tag: 'Technical & Platform Queries',
    phone: '+917720092989',
    phoneDisplay: '+91 77200 92989',
    email: 'sudhanshurahane89@gmail.com',
    initials: 'SR',
    avatarBg: 'bg-purple-600',
    whatsappMessage: 'Hello Sudhanshu, I need technical assistance with Ai-THON 2.0.',
  },
  {
    name: 'Umesh M. Khairnar',
    role: 'Technical Sub-Head & Core Organizer',
    tag: 'Technical & Payment Queries',
    phone: '+919975260955',
    phoneDisplay: '+91 99752 60955',
    email: 'khairnarumesh685@gmail.com',
    initials: 'UK',
    avatarBg: 'bg-blue-600',
    whatsappMessage: 'Hello Umesh, I need assistance with the Ai-THON 2.0 Registration & Verification.',
  },
  {
    name: 'Shree A. Ugale',
    role: 'Core Organizer & UPI Beneficiary',
    tag: 'UPI Account & Transaction Desk',
    phone: '+917841895180',
    phoneDisplay: '+91 78418 95180',
    email: 'shreeugale123@gmail.com',
    initials: 'SU',
    avatarBg: 'bg-emerald-600',
    whatsappMessage: 'Hello Shree, I need assistance with the Ai-THON 2.0 Registration & Payment.',
  },
  {
    name: 'Omkar R. Gopale',
    role: 'Jr. Developer & Coordinator',
    tag: 'Student Support & Verification',
    phone: '+917588004691',
    phoneDisplay: '+91 75880 04691',
    email: 'omkarravindra15@gmail.com',
    initials: 'OG',
    avatarBg: 'bg-amber-600',
    whatsappMessage: 'Hello Omkar, I have a query regarding Ai-THON 2.0.',
  },
  {
    name: 'Saad K. Shaikh',
    role: 'Jr. Developer & Coordinator',
    tag: 'Student Support & Desk',
    phone: '+918793869334',
    phoneDisplay: '+91 87938 69334',
    email: 'shaikhsaadp@gmail.com',
    initials: 'SS',
    avatarBg: 'bg-teal-600',
    whatsappMessage: 'Hello Saad, I have a query regarding Ai-THON 2.0.',
  },
  {
    name: 'AIESA Student Body',
    role: 'Event Management Team',
    tag: 'Official Helpdesk & Inquiries',
    phone: '',
    phoneDisplay: '',
    email: 'ai.veer2k26@gmail.com',
    initials: 'AI',
    avatarBg: 'bg-rose-600',
    whatsappMessage: 'Hello AIESA Team, I have an inquiry regarding Ai-THON 2.0.',
  },
]

export default function PaymentSupportWidget({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  showFloatingTrigger = true,
  teamId = '',
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen
  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose()
    } else {
      setInternalOpen(false)
    }
  }

  const handleOpen = () => {
    setInternalOpen(true)
  }

  // Prevent background scrolling when open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2500)
  }

  return (
    <>
      {/* ============================================================== */}
      {/* 1. FLOATING CONTACT / SUPPORT ICON BUTTON                      */}
      {/* ============================================================== */}
      {showFloatingTrigger && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center group">
          <button
            type="button"
            onClick={handleOpen}
            aria-label="Open payment support contact"
            className="flex items-center gap-2.5 px-4 py-3 sm:px-4.5 sm:py-3.5 rounded-full bg-gradient-to-r from-[#062b59] via-[#0b3b75] to-[#2563eb] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/40"
          >
            {/* Pulsing beacon & headset icon */}
            <div className="relative flex items-center justify-center">
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
              </span>
              <Headphones className="w-5 h-5 text-white" />
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-blue-200 leading-none">
                Helpline
              </div>
              <div className="text-xs font-black tracking-tight text-white leading-tight">
                Contact Coordinators
              </div>
            </div>

            <span className="sm:hidden text-xs font-black">Coordinators</span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. CONTACT DETAILS MODAL                                        */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-[#062b59]/60 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 transition-all my-8">
            {/* Header with gradient bar */}
            <div className="bg-gradient-to-r from-[#062b59] via-[#0b3b75] to-[#062b59] px-6 py-5 text-white relative">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest text-orange-300">
                    <Sparkles className="w-3 h-3 text-[#ea580c]" />
                    <span>Direct Helpline</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
                    Coordinators Support Desk
                  </h3>
                  <p className="text-xs text-blue-100/90 leading-relaxed font-medium">
                    Have questions regarding registration, screening, or technical support? Connect directly with our coordinators.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 ml-3"
                  aria-label="Close support dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Coordinator Cards */}
              <div className="space-y-3.5">
                {SUPPORT_CONTACTS.map((c, idx) => (
                  <div
                    key={c.name}
                    className="p-4 sm:p-4.5 rounded-2xl bg-[#faf9f6] border border-[#edebe6] hover:border-blue-300 transition-all shadow-xs hover:shadow-md space-y-3"
                  >
                    {/* Top Row: Avatar + Name + Tag */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl ${c.avatarBg} text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0`}
                        >
                          {c.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm sm:text-base font-extrabold text-[#062b59]">
                              {c.name}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            {c.role}
                          </p>
                          <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ea580c] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                            {c.tag}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact details row */}
                    <div className={`grid ${c.phone ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-2 text-xs pt-1 border-t border-[#edebe6]`}>
                      {/* Phone */}
                      {c.phone && (
                        <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2 min-w-0">
                            <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="font-mono font-bold text-slate-800 text-xs truncate">
                              {c.phoneDisplay}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(c.phone, idx)}
                            className="p-1 text-slate-400 hover:text-blue-600 transition-colors ml-1 cursor-pointer"
                            title="Copy phone number"
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Email */}
                      <a
                        href={`mailto:${c.email}?subject=Ai-THON%202.0%20Registration%20Inquiry${teamId ? `%20-%20${teamId}` : ''}`}
                        className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-all truncate"
                        title={c.email}
                      >
                        <Mail className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                        <span className="text-xs font-medium truncate">{c.email}</span>
                      </a>
                    </div>

                    {/* Action buttons (Call & WhatsApp or Email) */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {c.phone ? (
                        <>
                          <a
                            href={`tel:${c.phone}`}
                            className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-blue-50 text-[#062b59] border border-blue-200 font-bold text-xs uppercase tracking-wide transition-all shadow-2xs hover:border-blue-400 active:scale-98"
                          >
                            <Phone className="w-3.5 h-3.5 text-blue-600" />
                            <span>Call Now</span>
                          </a>

                          <a
                            href={`https://wa.me/${c.phone.replace('+', '')}?text=${encodeURIComponent(
                              `${c.whatsappMessage}${teamId ? ` Team ID: ${teamId}.` : ''}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wide transition-all shadow-2xs hover:shadow-sm active:scale-98"
                          >
                            <WhatsAppIcon className="w-4 h-4 fill-white" />
                            <span>WhatsApp</span>
                          </a>
                        </>
                      ) : (
                        <a
                          href={`mailto:${c.email}?subject=Ai-THON%202.0%20Inquiry`}
                          className="col-span-2 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#062b59] hover:bg-[#1e3a8a] text-white font-bold text-xs uppercase tracking-wide transition-all shadow-2xs"
                        >
                          <Mail className="w-3.5 h-3.5 text-white" />
                          <span>Send Email</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Helpful Guidance Notice */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Quick Resolution Tip:</strong>
                  Please mention your <strong>Team ID</strong> and <strong>12-digit UTR</strong> when messaging so our coordinators can immediately verify your records.
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Official Organizing Committee Desk
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
