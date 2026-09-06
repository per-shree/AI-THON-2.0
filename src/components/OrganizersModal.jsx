import React, { useState, useEffect } from 'react'
import { X, Phone, Mail, MessageSquare } from 'lucide-react'

export default function OrganizersModal({ isOpen, onClose }) {
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

  if (!isOpen) return null

  const members = [
    {
      name: 'Vedant J. Mande',
      role: 'President & Core Organizer',
      org: 'AIESA Committee',
      type: 'STUDENT',
      category: 'CORE ORGANIZER',
      phone: '+918591910018',
      phoneDisplay: '8591910018',
      email: 'work.vedantmande@gmail.com',
      initials: 'VM'
    },
    {
      name: 'Sudhanshu M. Rahane',
      role: 'Technical Head & Core Organizer',
      org: 'AIESA Committee',
      type: 'STUDENT',
      category: 'CORE ORGANIZER',
      phone: '+917720092989',
      phoneDisplay: '7720092989',
      email: 'sudhanshurahane89@gmail.com',
      initials: 'SR'
    },
    {
      name: 'Umesh M. Khairnar',
      role: 'Technical Sub-Head & Core Organizer',
      org: 'AIESA Committee',
      type: 'STUDENT',
      category: 'CORE ORGANIZER',
      phone: '+919975260955',
      phoneDisplay: '9975260955',
      email: 'khairnarumesh685@gmail.com',
      initials: 'UK'
    },
    {
      name: 'Shree A. Ugale',
      role: 'Core Organizer',
      org: 'Organizing Committee',
      type: 'STUDENT',
      category: 'CORE ORGANIZER',
      phone: '+917841895180',
      phoneDisplay: '7841895180',
      email: 'shreeugale123@gmail.com',
      initials: 'SU'
    },
    {
      name: 'Omkar R. Gopale',
      role: 'Jr. Developer',
      org: 'AIESA Committee',
      type: 'STUDENT',
      category: 'CORE ORGANIZER',
      phone: '+917588004691',
      phoneDisplay: '7588004691',
      email: 'omkarravindra15@gmail.com',
      initials: 'OG'
    },
    {
      name: 'Saad K. Shaikh',
      role: 'Jr. Developer',
      org: 'AIESA Committee',
      type: 'STUDENT',
      category: 'CORE ORGANIZER',
      phone: '+918793869334',
      phoneDisplay: '8793869334',
      email: 'shaikhsaadp@gmail.com',
      initials: 'SS'
    },
    {
      name: 'AIESA Student Body',
      role: 'Event Management Team',
      org: 'Dept. of AI & DS',
      type: 'STUDENT',
      category: 'STUDENT TEAM',
      email: 'aiesa.avcoe@gmail.com',
      initials: 'AI'
    }
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-[85vh] flex flex-col my-auto text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Minimal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              ORGANIZING COMMITTEE
            </span>
            <h2 className="text-xl font-bold text-[#062b59] tracking-tight mt-0.5">
              Organizers & Coordinators
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profiles List */}
        <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-100">
          {members.map((m, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              {/* Member Info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {m.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#062b59] truncate">
                    {m.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                    {m.role} • <span className="text-slate-400">{m.org}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons (Clean Outline) */}
              {(m.phone || m.email) && (
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  {m.phone && (
                    <>
                      <a
                        href={`tel:${m.phone}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium transition-colors"
                      >
                        <Phone size={12} className="text-slate-500" />
                        {m.phoneDisplay}
                      </a>
                      <a
                        href={`https://wa.me/${m.phone.replace('+', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium transition-colors"
                      >
                        <MessageSquare size={12} className="text-emerald-600" />
                        WhatsApp
                      </a>
                    </>
                  )}
                  {m.email && !m.phone && (
                    <a
                      href={`mailto:${m.email}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium transition-colors"
                    >
                      <Mail size={12} className="text-slate-500" />
                      {m.email}
                    </a>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Minimal Footer */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            AITHON 2.0 • Department of AI & DS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}
