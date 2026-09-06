import { useEffect } from 'react'
import { CheckIcon, XMarkIcon, UsersIcon } from '../Icons'

/**
 * ApproveTeamModal — Confirmation dialog before approving a team.
 * Props:
 *   isOpen: boolean
 *   teamName: string
 *   onConfirm: () => void
 *   onCancel: () => void
 */
export default function ApproveTeamModal({ isOpen, teamName, onConfirm, onCancel }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="approve-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e1220] border border-slate-800 shadow-[0_0_40px_rgba(6,182,212,0.12)] p-6 space-y-5 animate-fadeIn">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 id="approve-modal-title" className="text-base font-mono font-bold text-white m-0">
                Approve Team?
              </h2>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                This action cannot be automatically undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-400">Team to be approved:</span>
          </div>
          <p className="text-base font-mono font-bold text-white">
            &ldquo;{teamName}&rdquo;
          </p>
          <p className="text-xs font-sans text-slate-400 leading-relaxed">
            The team will be marked as <strong className="text-emerald-400">officially approved</strong> and
            will gain access to submission portals and resource credits.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-pointer"
          >
            <CheckIcon className="w-4 h-4" />
            <span>APPROVE TEAM</span>
          </button>
        </div>
      </div>
    </div>
  )
}
