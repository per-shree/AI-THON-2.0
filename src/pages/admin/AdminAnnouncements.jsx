import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import AdminLayout from '../../components/admin/AdminLayout'
import CreateAnnouncementModal from '../../components/admin/CreateAnnouncementModal'
import {
  PlusIcon,
  FilterIcon,
} from '../../components/Icons'

export default function AdminAnnouncements() {
  const { announcements } = useAdmin()
  const [modalOpen, setModalOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  const filtered = announcements.filter((a) => {
    return categoryFilter === 'ALL' || a.category.toUpperCase() === categoryFilter
  })

  return (
    <AdminLayout
      title="Announcements"
      breadcrumbs={[{ label: 'Engagement' }, { label: 'Announcements' }]}
    >
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold font-mono text-white tracking-tight m-0">
              Announcements & Broadcasts
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Publish official alerts and resource links directly to all participants.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            <PlusIcon className="w-4 h-4 stroke-[2.5]" />
            <span>+ NEW ANNOUNCEMENT</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 p-1.5 bg-[#0d111d] rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto">
          <div className="px-2 text-slate-500 flex items-center gap-1">
            <FilterIcon className="w-3.5 h-3.5" />
          </div>
          {['ALL', 'IMPORTANT', 'RESOURCES', 'SCHEDULE'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0d111d] border border-slate-800 text-slate-500 font-mono text-xs">
              No announcements found under this category.
            </div>
          ) : (
            filtered.map((ann) => (
              <div
                key={ann.id}
                className="rounded-2xl bg-[#0d111d] border border-slate-800 p-5 sm:p-6 space-y-3 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        ann.priority === 'High' || ann.priority === 'Urgent'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {ann.priority} Priority
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono">
                      {ann.category}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400">
                      Audience: {ann.audience}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    Posted by <strong className="text-slate-300">{ann.author}</strong> • {ann.postedAt}
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-mono font-bold text-white m-0">
                    {ann.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1.5 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CreateAnnouncementModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </AdminLayout>
  )
}
