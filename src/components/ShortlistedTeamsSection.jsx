import React, { useState, useMemo } from 'react'
import {
  Trophy,
  Search,
  Users,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
  Building,
  ShieldCheck,
  AlertTriangle,
  Mail,
} from 'lucide-react'
import { SHORTLISTED_TEAMS, SHORTLIST_METADATA } from '../data/shortlistedTeams'

export default function ShortlistedTeamsSection({ id = "results" }) {
  const [searchTerm, setSearchTerm] = useState('')

  // Filtered teams based on search query
  const filteredTeams = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return SHORTLISTED_TEAMS
    return SHORTLISTED_TEAMS.filter(
      (team) =>
        team.id.toLowerCase().includes(term) ||
        team.teamName.toLowerCase().includes(term) ||
        team.leaderName.toLowerCase().includes(term)
    )
  }, [searchTerm])

  return (
    <section id={id} className="bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-12 scroll-mt-16 sm:scroll-mt-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Top Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-2xs mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-emerald-700">
            ROUND 1 RESULTS ANNOUNCED
          </span>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#062b59] tracking-tight leading-tight">
            GRAND FINALE SHORTLISTED TEAMS
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Heartiest congratulations to all <span className="font-bold text-[#062b59]">{SHORTLIST_METADATA.totalShortlisted} teams</span> selected for the Grand Finale of <span className="font-semibold text-[#2563eb]">AI-THON 2.0</span>! Evaluated rigorously by our industry expert panel.
          </p>
        </div>

        {/* Highlight Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mb-8">
          <div className="bg-[#faf9f6] border border-[#edebe6] rounded-xl p-3.5 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#2563eb] mb-1">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xl sm:text-2xl font-black text-[#062b59]">105</span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Shortlisted Teams</p>
          </div>

          <div className="bg-[#faf9f6] border border-[#edebe6] rounded-xl p-3.5 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-base sm:text-lg font-black text-[#062b59]">23 OCT 2026</span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Grand Finale Date</p>
          </div>

          <div className="bg-[#faf9f6] border border-[#edebe6] rounded-xl p-3.5 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-orange-600 mb-1">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-base sm:text-lg font-black text-[#062b59]">12 Hours</span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Non-Stop Offline Hack</p>
          </div>

          <div className="bg-[#faf9f6] border border-[#edebe6] rounded-xl p-3.5 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-indigo-600 mb-1">
              <Building className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-base sm:text-lg font-black text-[#062b59]">AVCOE</span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Sangamner Campus</p>
          </div>
        </div>

        {/* Official Confirmation Mail Alert Banner for Finalists */}
        <div className="w-full max-w-5xl mb-6 bg-gradient-to-r from-blue-50/95 via-sky-50/80 to-indigo-50/90 border-l-4 border-[#2563eb] border border-blue-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/15 text-[#2563eb] flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-5 h-5 text-[#2563eb]" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-[#062b59] uppercase tracking-wider">
                  GRAND FINALE CONFIRMATION & INSTRUCTIONS
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#2563eb] text-white text-[10px] font-black uppercase tracking-widest">
                  OFFICIAL NOTICE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Official Grand Finale confirmation details, venue guidelines, and reporting schedules will be sent directly to the <strong className="text-[#062b59] font-bold">Team Leader&apos;s registered email address</strong>. All team leads are requested to check their email inbox (and spam/promotions folder).
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-5xl mb-6 bg-[#faf9f6] border border-[#edebe6] p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          
          {/* Search Box */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Team ID (e.g. TEAM-134), Team Name, or Leader..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all placeholder:text-slate-400 text-slate-800 font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Result Count */}
          <div className="flex items-center justify-end w-full sm:w-auto shrink-0">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Showing <strong className="text-[#062b59] font-bold">{filteredTeams.length}</strong> of {SHORTLIST_METADATA.totalShortlisted} teams
            </span>
          </div>
        </div>

        {/* Cards Grid Display - Shown completely without inner scrolling */}
        <div className="w-full max-w-5xl">
          {filteredTeams.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center text-center py-12 sm:py-16 px-4 sm:px-6 bg-[#faf9f6] border border-[#edebe6] rounded-2xl shadow-2xs">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border border-slate-200">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#062b59] mb-2">
                No Matching Teams Found
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                We couldn't find any team matching{' '}
                <span className="font-bold text-[#062b59] bg-white px-2 py-0.5 rounded border border-slate-200 inline-block my-0.5">
                  "{searchTerm}"
                </span>
                . Please check the spelling or Team ID format (e.g.{' '}
                <span className="font-semibold text-[#2563eb]">TEAM-134</span>).
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#062b59] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow-sm"
              >
                <X className="w-4 h-4" />
                <span>Clear Search Filter</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 w-full">
              {filteredTeams.map((team) => {
                const originalIndex = SHORTLISTED_TEAMS.findIndex((t) => t.id === team.id) + 1
                return (
                  <div
                    key={team.id}
                    className="bg-white border border-[#edebe6] hover:border-[#2563eb] rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 group-hover:bg-blue-100 text-[#062b59] rounded border border-slate-200">
                          {team.id}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          #{originalIndex}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#062b59] group-hover:text-[#2563eb] transition-colors leading-snug mb-1">
                        {team.teamName}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Lead: <strong className="text-slate-800">{team.leaderName}</strong></span>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Shortlisted
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Evaluation Accreditation Box */}
        <div className="w-full max-w-5xl mt-10 bg-[#faf9f6] border border-[#edebe6] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-[#2563eb]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#2563eb] uppercase tracking-wider mb-0.5">
                OFFICIAL EVALUATION COMMITTEE
              </p>
              <h3 className="text-sm sm:text-base font-bold text-[#062b59]">
                Analysed & Evaluated By Industry Experts
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Round 1 idea PPT abstracts were evaluated strictly based on innovation, technical feasibility, real-world impact, and problem statement alignment.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 shrink-0 w-full md:w-auto">
            {SHORTLIST_METADATA.evaluators.map((evaluator, idx) => (
              <div key={idx} className="text-left">
                <p className="text-xs sm:text-sm font-bold text-[#062b59]">{evaluator.name}</p>
                <p className="text-[11px] font-semibold text-slate-500">{evaluator.designation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions for Qualified Finalists */}
        <div className="w-full max-w-5xl mt-6 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/60 rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm sm:text-base font-bold text-[#062b59] flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-[#2563eb]" />
            <span>Important Next Steps for Finalist Teams</span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-[13px] text-slate-700">
            <li className="bg-white/90 p-3.5 rounded-xl border border-blue-200 shadow-2xs">
              <strong className="text-[#062b59] block mb-1">1. Confirmation Mail to Team Leader</strong>
              Official Grand Finale confirmation letters, reporting schedules, and workstation guidelines are sent directly to the team leader&apos;s registered email. Please check your inbox and spam folder.
            </li>
            <li className="bg-white/80 p-3 rounded-xl border border-blue-100">
              <strong className="text-[#062b59] block mb-1">2. Check Email & WhatsApp Community</strong>
              The team leader must check their email for reporting guidelines, schedule, and join the finalists&apos; official communication group.
            </li>
            <li className="bg-white/80 p-3 rounded-xl border border-blue-100">
              <strong className="text-[#062b59] block mb-1">3. Venue Reporting (23 Oct 2026)</strong>
              All team members must report in-person at Amrutvahini College of Engineering (AVCOE), Sangamner with valid college IDs.
            </li>
          </ul>
        </div>

      </div>
    </section>
  )
}
