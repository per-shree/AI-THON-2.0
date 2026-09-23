import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { RollingNumber } from '@kitlangton/rolling-number/react'
import { useAdmin } from '../../context/AdminContext'
import AdminLayout from '../../components/admin/AdminLayout'
import StatusBadge from '../../components/admin/StatusBadge'
import ApproveTeamModal from '../../components/admin/ApproveTeamModal'
import RejectTeamModal from '../../components/admin/RejectTeamModal'
import { SearchIcon, FilterIcon, EyeIcon, CheckIcon, XMarkIcon } from '../../components/Icons'

export default function AdminTeams() {
  const { teams, teamStats, approveTeam, rejectTeam } = useAdmin()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')

  // Derive statusFilter directly from the URL ?status= param (no useEffect needed)
  const urlStatus = searchParams.get('status')
  const statusFilter = urlStatus ? urlStatus.toUpperCase() : 'ALL'

  // Toast notification state
  const [toast, setToast] = useState(null)

  // Approval modal state
  const [approveModal, setApproveModal] = useState({ open: false, team: null })

  // Rejection modal state
  const [rejectModal, setRejectModal] = useState({ open: false, team: null })

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleFilterChange = (filter) => {
    // Update URL param — statusFilter is derived from URL so no setState needed
    if (filter === 'ALL') {
      searchParams.delete('status')
    } else {
      searchParams.set('status', filter.toLowerCase())
    }
    setSearchParams(searchParams)
  }

  const handleApproveConfirm = () => {
    if (!approveModal.team) return
    approveTeam(approveModal.team.id)
    showToast(`✓ Team "${approveModal.team.name}" approved successfully.`, 'success')
    setApproveModal({ open: false, team: null })
  }

  const handleRejectConfirm = (reason, additionalDetails) => {
    if (!rejectModal.team) return
    rejectTeam(rejectModal.team.id, reason, additionalDetails)
    showToast(`✕ Team "${rejectModal.team.name}" rejected.`, 'error')
    setRejectModal({ open: false, team: null })
  }

  const filtered = teams.filter((t) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      t.name.toLowerCase().includes(q) ||
      t.leadName.toLowerCase().includes(q) ||
      t.college.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)

    const matchesStatus =
      statusFilter === 'ALL' || t.status.toUpperCase() === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout
      title="Teams"
      breadcrumbs={[{ label: 'Management' }, { label: 'Teams' }]}
    >
      <div className="space-y-6 animate-fadeIn">

        {/* Toast Notification */}
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

        {/* Header & Live Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold font-mono text-white tracking-tight m-0">
              Team Management
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Review team rosters, approve or reject registrations, and track submission readiness.
            </p>
          </div>

          {/* Live Stat Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleFilterChange('ALL')}
              className="px-3 py-1.5 rounded-lg bg-[#0d111d] border border-slate-800 text-slate-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
            >
              Total: <strong className="text-cyan-400"><RollingNumber value={teamStats.total} duration={400} /></strong>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('APPROVED')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/60 transition-colors cursor-pointer"
            >
              Approved: <strong><RollingNumber value={teamStats.approved} duration={400} /></strong>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('PENDING')}
              className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-400 hover:bg-amber-950/60 transition-colors cursor-pointer"
            >
              Pending: <strong><RollingNumber value={teamStats.pending} duration={400} /></strong>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('REJECTED')}
              className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-950/60 transition-colors cursor-pointer"
            >
              Rejected: <strong><RollingNumber value={teamStats.rejected} duration={400} /></strong>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0d111d] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Team ID, name, leader, college..."
              aria-label="Search teams"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#090b14] border border-slate-800 text-xs font-sans text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto w-full sm:w-auto">
            <div className="px-2 text-slate-500 flex items-center gap-1 shrink-0">
              <FilterIcon className="w-3.5 h-3.5" />
            </div>
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleFilterChange(st)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
                {st === 'PENDING' && teamStats.pending > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 text-[10px]">
                    {teamStats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Teams Table */}
        <div className="rounded-2xl bg-[#0d111d] border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="text-[11px] font-mono uppercase text-slate-400 bg-slate-900/50 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Team ID &amp; Name</th>
                  <th className="py-3.5 px-4">Team Leader</th>
                  <th className="py-3.5 px-4">College</th>
                  <th className="py-3.5 px-4">Track</th>
                  <th className="py-3.5 px-4">Members</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Registered</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 font-mono text-xs">
                      No teams found matching your search or filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/admin/teams/${t.id}`}
                          className="font-mono font-bold text-slate-100 hover:text-cyan-400 block transition-colors"
                        >
                          {t.name}
                        </Link>
                        <span className="text-[10px] font-mono text-cyan-400/80">{t.id}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{t.leadName}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{t.leadEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-[140px] truncate">{t.college}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-[10px]">
                          {t.track}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                        {t.teamSize}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {t.registeredDate}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {t.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => setApproveModal({ open: true, team: t })}
                                title="Approve Team"
                                aria-label={`Approve ${t.name}`}
                                className="p-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/30 text-emerald-400 transition-colors cursor-pointer"
                              >
                                <CheckIcon className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectModal({ open: true, team: t })}
                                title="Reject Team"
                                aria-label={`Reject ${t.name}`}
                                className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/70 border border-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                              >
                                <XMarkIcon className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          <Link
                            to={`/admin/teams/${t.id}`}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 transition-colors inline-block"
                            title="View Team Details"
                            aria-label={`View details for ${t.name}`}
                          >
                            <EyeIcon className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Approval Confirmation Modal */}
      <ApproveTeamModal
        isOpen={approveModal.open}
        teamName={approveModal.team?.name || ''}
        onConfirm={handleApproveConfirm}
        onCancel={() => setApproveModal({ open: false, team: null })}
      />

      {/* Rejection Reason Modal */}
      <RejectTeamModal
        isOpen={rejectModal.open}
        teamName={rejectModal.team?.name || ''}
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectModal({ open: false, team: null })}
      />
    </AdminLayout>
  )
}
