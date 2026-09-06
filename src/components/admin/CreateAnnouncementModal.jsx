import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { XMarkIcon, AnnouncementIcon, SparklesIcon } from '../Icons'

export default function CreateAnnouncementModal({ isOpen, onClose }) {
  const { addAnnouncement } = useAdmin()
  const [formData, setFormData] = useState({
    title: '',
    audience: 'All Teams',
    category: 'Important',
    priority: 'Normal',
    content: '',
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in both title and announcement content.')
      return
    }

    addAnnouncement(formData)
    setFormData({
      title: '',
      audience: 'All Teams',
      category: 'Important',
      priority: 'Normal',
      content: '',
    })
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0d111d] border border-slate-800 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <AnnouncementIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider m-0">
                Create Announcement
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Broadcast official updates to hackathon teams & participants.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-400 text-xs font-mono">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              Announcement Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Submissions window extended by 2 hours"
              className="w-full rounded-xl bg-[#090b14] border border-slate-800 px-3.5 py-2.5 text-xs font-sans text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
              required
            />
          </div>

          {/* Audience & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Audience</label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className="w-full rounded-xl bg-[#090b14] border border-slate-800 px-2.5 py-2 text-xs font-sans text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="All Teams">All Teams</option>
                <option value="All Participants">All Participants</option>
                <option value="Approved Teams">Approved Teams</option>
                <option value="Judges & Evaluation Panel">Judges & Evaluation Panel</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl bg-[#090b14] border border-slate-800 px-2.5 py-2 text-xs font-sans text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="Important">Important</option>
                <option value="Resources">Resources</option>
                <option value="Schedule">Schedule</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full rounded-xl bg-[#090b14] border border-slate-800 px-2.5 py-2 text-xs font-sans text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Content Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold text-slate-300">
              Message Content *
            </label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write detailed instructions or announcement content..."
              className="w-full rounded-xl bg-[#090b14] border border-slate-800 p-3 text-xs font-sans text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Broadcast Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
