import React, { useState } from 'react'
import { Check, Cloud, RefreshCw, AlertTriangle, Trash2, Clock } from 'lucide-react'
import { formatSavedTime } from '../utils/formDraftStorage'

export default function AutoSaveIndicator({
  saveStatus = 'saved', // 'saving' | 'saved' | 'idle' | 'restored'
  lastSavedAt,
  onResetDraft,
  currentStep,
  hasDraftData = false,
}) {
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  return (
    <>
      <div className="w-full flex items-center justify-between flex-wrap gap-2 py-2 px-3 sm:px-4 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs backdrop-blur-xs text-xs mb-5 transition-all">
        {/* Left Side: Auto-Save Status */}
        <div className="flex items-center gap-2 text-slate-600">
          {saveStatus === 'saving' ? (
            <span className="flex items-center gap-1.5 text-blue-600 font-medium animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving progress automatically...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-medium text-emerald-700">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Cloud className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Form progress saved automatically
                {lastSavedAt ? ` (${formatSavedTime(lastSavedAt)})` : ''}
              </span>
            </span>
          )}
        </div>

        {/* Right Side: Reassurance & Start Fresh action */}
        <div className="flex items-center gap-3 ml-auto text-[11px] text-slate-500">
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Safe to close tab & return anytime</span>
          </span>

          {hasDraftData && onResetDraft && (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="text-slate-400 hover:text-red-600 font-medium underline underline-offset-2 transition-colors cursor-pointer"
              title="Clear saved draft and start with an empty form"
            >
              Start Fresh
            </button>
          )}
        </div>
      </div>

      {/* Confirm Reset Draft Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-left">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Start Fresh & Clear Draft?</h3>
                <p className="text-xs text-slate-500">This will reset all entered fields back to Step 1.</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed my-4">
              Are you sure you want to clear your saved progress? All details entered for your team, leader, and members will be cleared from this browser.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Keep My Progress
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmReset(false)
                  onResetDraft()
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Reset Form</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
