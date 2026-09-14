import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import AdminLayout from '../../components/admin/AdminLayout'
import StatusBadge from '../../components/admin/StatusBadge'
import ApproveTeamModal from '../../components/admin/ApproveTeamModal'
import RejectTeamModal from '../../components/admin/RejectTeamModal'
import {
  UsersIcon,
  MailIcon,
  AcademicCapIcon,
  SubmissionIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
} from '../../components/Icons'

export default function AdminTeamDetail() {
  const { id } = useParams()
  const { teams, submissions, approveTeam, rejectTeam } = useAdmin()
  const navigate = useNavigate()

  // Find team, fall back to first if not found
  const team = teams.find((t) => t.id === id) || teams[0]
  const submission = submissions.find(
    (s) => s.teamId === team.id || s.teamName === team.name
  )

  // Modal state
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)

  // Toast
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleApproveConfirm = () => {
    approveTeam(team.id)
    setApproveModalOpen(false)
    showToast(`✓ Team "${team.name}" approved successfully.`, 'success')
  }

  const handleRejectConfirm = (reason, additionalDetails) => {
    rejectTeam(team.id, reason, additionalDetails)
    setRejectModalOpen(false)
    showToast(`✕ Team "${team.name}" has been rejected.`, 'error')
  }

  const isPending = team.status === 'pending'
  const isApproved = team.status === 'approved'
  const isRejected = team.status === 'rejected'

  return (
    <AdminLayout
      title={`Team: ${team.name}`}
      breadcrumbs={[
        { label: 'Management' },
        { label: 'Teams', path: '/admin/teams' },
        { label: team.id },
      ]}
    >
      <div className="space-y-6 animate-fadeIn max-w-5xl">

        {/* Toast */}
        {toast && (
          <div
            role="status"
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-xs font-mono font-semibold shadow-2xl border animate-fadeIn ${
              toast.type === 'success'
                ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950 border-rose-500/50 text-rose-300'
            }`}
          >
            {toast.msg}
          </div>
        )}

        {/* Top Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/admin/teams')}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Teams List</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Current Status:</span>
            <StatusBadge status={team.status} />
          </div>
        </div>

        {/* Team Summary Card */}
        <div className="rounded-2xl bg-[#0d111d] border border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0">
                <UsersIcon className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-mono font-bold text-white m-0 flex flex-wrap items-center gap-2">
                  {team.name}
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                    {team.id}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  {team.college} • Registered on {team.registeredDate}
                </p>
              </div>
            </div>

            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 whitespace-nowrap">
              Track: <strong className="text-white">{team.track}</strong>
            </span>
          </div>

          {/* Detail Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
            {[
              { label: 'TEAM ID', value: team.id },
              { label: 'TEAM SIZE', value: `${team.teamSize || team.membersCount || 4} Members` },
              { label: 'TRACK', value: team.track },
              { label: 'REGISTERED', value: team.registeredDate || team.registeredAt || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">{label}</span>
                <span className="text-xs font-mono font-semibold text-slate-100 break-all">{value}</span>
              </div>
            ))}
          </div>

          {(team.pptDriveUrl || team.pptFileName) && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">
                  Idea Presentation (Drive Sync)
                </span>
                <span className="text-xs font-mono text-slate-200">
                  {team.id}.pptx {team.pptFileName ? `• ${team.pptFileName}` : ''}
                </span>
              </div>
              {team.pptDriveUrl && team.pptDriveUrl.startsWith('http') && (
                <a
                  href={team.pptDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50 text-xs font-mono font-semibold transition-colors shrink-0"
                >
                  <span>Open in Drive</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* ─── REVIEW SECTION ──────────────────────────────────────────── */}

        {/* PENDING: Show review action panel */}
        {isPending && (
          <div className="rounded-2xl bg-[#0d111d] border border-amber-500/30 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold text-amber-300 m-0">
                  TEAM AWAITING REVIEW
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  This team has not yet been reviewed. Review the member roster below before taking action.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setApproveModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(34,197,94,0.25)] cursor-pointer"
              >
                <CheckIcon className="w-4 h-4" />
                <span>✓ APPROVE TEAM</span>
              </button>

              <button
                type="button"
                onClick={() => setRejectModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>✕ REJECT TEAM</span>
              </button>
            </div>
          </div>
        )}

        {/* APPROVED: Show approved status panel */}
        {isApproved && (
          <div className="rounded-2xl bg-[#0d111d] border border-emerald-500/30 p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold text-emerald-400 m-0">
                  ✓ TEAM APPROVED
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  This team has been verified and approved to participate in AI THON 2.0.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Approved On</span>
                <span className="text-xs font-mono font-semibold text-emerald-300">
                  {team.reviewedAt || '—'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Reviewed By</span>
                <span className="text-xs font-mono font-semibold text-slate-100">
                  {team.reviewedBy || 'Admin'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* REJECTED: Show rejected status + reason panel */}
        {isRejected && (
          <div className="rounded-2xl bg-[#0d111d] border border-rose-500/30 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <XMarkIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold text-rose-400 m-0">
                  ✕ TEAM REJECTED
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  This team was not approved. The rejection reason is recorded below.
                </p>
              </div>
            </div>

            {/* Rejection Reason */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
              <span className="text-[10px] font-mono uppercase text-rose-400/70 tracking-wider block">
                Rejection Reason
              </span>
              <p className="text-xs font-mono font-semibold text-rose-200">
                {team.rejectionReason || 'No reason provided.'}
              </p>
              {team.rejectionDetails && (
                <p className="text-xs font-sans text-slate-400 leading-relaxed pt-1 border-t border-rose-500/20">
                  {team.rejectionDetails}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Reviewed On</span>
                <span className="text-xs font-mono font-semibold text-rose-300">
                  {team.reviewedAt || '—'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Reviewed By</span>
                <span className="text-xs font-mono font-semibold text-slate-100">
                  {team.reviewedBy || 'Admin'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Members Roster */}
        <div className="rounded-2xl bg-[#0d111d] border border-slate-800 p-6 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 m-0">
            Team Roster — {team.members?.length || team.teamSize} Members
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(team.members || []).map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-400 shrink-0">
                      {idx + 1}
                    </div>
                    <span className="font-semibold text-slate-100 text-xs">{m.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded whitespace-nowrap">
                    {m.role || (idx === 0 ? 'Leader' : 'Member')}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-sans flex items-center gap-2">
                  <MailIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{m.email}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans flex items-center gap-2">
                  <AcademicCapIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{m.college}</span>
                </div>
                {m.course && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="w-3.5 h-3.5 shrink-0" />
                    <span>{m.course} • {m.year}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Review History */}
        {team.reviewHistory && team.reviewHistory.length > 0 && (
          <div className="rounded-2xl bg-[#0d111d] border border-slate-800 p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 m-0">
              Review History
            </h3>

            <div className="space-y-3">
              {team.reviewHistory.map((entry, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 p-4 rounded-xl border text-xs font-sans ${
                    entry.action === 'approved'
                      ? 'bg-emerald-950/20 border-emerald-500/20'
                      : 'bg-rose-950/20 border-rose-500/20'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      entry.action === 'approved'
                        ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                        : 'bg-rose-950 border border-rose-500/40 text-rose-400'
                    }`}
                  >
                    {entry.action === 'approved'
                      ? <CheckIcon className="w-4 h-4" />
                      : <XMarkIcon className="w-4 h-4" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className={`font-mono font-bold capitalize ${
                        entry.action === 'approved' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        Team {entry.action}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {entry.reviewedAt} — {entry.reviewedBy}
                      </span>
                    </div>
                    {entry.reason && (
                      <p className="text-slate-400 leading-relaxed">
                        Reason: <span className="text-slate-200">{entry.reason}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linked Project Submission */}
        <div className="rounded-2xl bg-[#0d111d] border border-slate-800 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 m-0 flex items-center gap-2">
              <SubmissionIcon className="w-4 h-4 text-cyan-400" />
              <span>Project Submission</span>
            </h3>
            {submission && <StatusBadge status={submission.status} />}
          </div>

          {submission ? (
            <div className="p-4 rounded-xl bg-[#090b14] border border-slate-800 space-y-3">
              <div>
                <h4 className="text-sm font-mono font-bold text-white m-0">{submission.projectTitle}</h4>
                <p className="text-xs text-slate-400 font-sans mt-1">{submission.tagline}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {submission.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-500">
                  Submitted {submission.submittedAt} • Score:{' '}
                  <strong className="text-cyan-400">{submission.score}/100</strong>
                </span>
                <Link
                  to={`/admin/submissions/${submission.id}`}
                  className="text-xs font-mono font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Evaluate Submission</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs font-mono text-slate-500">
              No project submission uploaded yet by this team.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ApproveTeamModal
        isOpen={approveModalOpen}
        teamName={team.name}
        onConfirm={handleApproveConfirm}
        onCancel={() => setApproveModalOpen(false)}
      />
      <RejectTeamModal
        isOpen={rejectModalOpen}
        teamName={team.name}
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectModalOpen(false)}
      />
    </AdminLayout>
  )
}
