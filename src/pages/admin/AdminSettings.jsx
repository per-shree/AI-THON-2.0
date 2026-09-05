import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { SparklesIcon, CheckIcon } from '../../components/Icons'
import {
  getGoogleSheetUrl,
  saveGoogleSheetUrl,
  testGoogleSheetWebhook,
} from '../../services/googleSheetsService'

export default function AdminSettings() {
  const { settings, updateSettings, adminUser } = useAdmin()
  const [formData, setFormData] = useState({ ...settings })
  const [profileName, setProfileName] = useState(adminUser.name)
  const [profileEmail, setProfileEmail] = useState(adminUser.email)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [sheetUrl, setSheetUrl] = useState(() => getGoogleSheetUrl() || '')
  const [testStatus, setTestStatus] = useState({ state: 'idle', message: '' })

  const handleTestWebhook = async () => {
    setTestStatus({ state: 'testing', message: 'Testing Google Apps Script endpoint...' })
    const res = await testGoogleSheetWebhook(sheetUrl)
    if (res.success) {
      setTestStatus({ state: 'success', message: res.message })
    } else {
      setTestStatus({ state: 'error', message: res.message })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateSettings(formData)
    saveGoogleSheetUrl(sheetUrl)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <AdminLayout
      title="System Settings"
      breadcrumbs={[{ label: 'System' }, { label: 'Settings' }]}
    >
      <div className="space-y-6 animate-fadeIn max-w-4xl">
        {/* Header */}
        <div className="pb-3 border-b border-slate-800">
          <h1 className="text-2xl font-extrabold font-mono text-white tracking-tight m-0">
            System & Hackathon Settings
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Configure global registration controls, evaluation deadlines, and administrator credentials.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckIcon className="w-4 h-4" />
            <span>Settings and configuration saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hackathon Portal Control */}
          <div className="rounded-2xl bg-[#0d111d] border border-slate-800 p-6 space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 pb-2 border-b border-slate-800 m-0">
              Registration & Submission Controls
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <span className="text-xs font-mono font-semibold text-white block">
                    Public Registration Portal
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Enable or pause new team registrations
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.registrationOpen}
                  onChange={(e) =>
                    setFormData({ ...formData, registrationOpen: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-900 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <span className="text-xs font-mono font-semibold text-white block">
                    Project Submission Window
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Allow teams to upload repository links
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.submissionsOpen}
                  onChange={(e) =>
                    setFormData({ ...formData, submissionsOpen: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-900 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  Submission Deadline Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.submissionDeadline}
                  onChange={(e) =>
                    setFormData({ ...formData, submissionDeadline: e.target.value })
                  }
                  className="w-full rounded-xl bg-[#090b14] border border-slate-800 p-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  Discord Server Invite URL
                </label>
                <input
                  type="url"
                  value={formData.discordInviteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, discordInviteUrl: e.target.value })
                  }
                  placeholder="https://discord.gg/..."
                  className="w-full rounded-xl bg-[#090b14] border border-slate-800 p-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Google Sheets Integration Card */}
          <div className="rounded-2xl bg-[#0d111d] border border-slate-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 m-0">
                  Google Sheets Live Registration Sync
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                  ai.veer2k26@gmail.com
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Apps Script Webhook
              </span>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed m-0">
              Registrations automatically submit Team ID, Registration ID, full team leader details, and all teammate entries directly to your Google Sheet in real-time.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold text-slate-300 flex items-center justify-between">
                <span>Google Apps Script Web App URL</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  (Deploy from Google Sheets under ai.veer2k26@gmail.com)
                </span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={sheetUrl}
                  onChange={(e) => {
                    setSheetUrl(e.target.value)
                    setTestStatus({ state: 'idle', message: '' })
                  }}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="flex-1 rounded-xl bg-[#090b14] border border-slate-800 p-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={testStatus.state === 'testing'}
                  className="px-4 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  {testStatus.state === 'testing' ? 'Testing...' : 'Test Webhook'}
                </button>
              </div>

              {testStatus.message && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-mono flex items-center gap-2 ${
                    testStatus.state === 'success'
                      ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                  }`}
                >
                  <span>{testStatus.state === 'success' ? '✓' : '⚠'}</span>
                  <span>{testStatus.message}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1 font-mono">
                <div className="text-slate-300 font-semibold">Quick Setup Guide:</div>
                <div className="text-slate-400">1. Open Google Sheets logged in as <span className="text-emerald-400">ai.veer2k26@gmail.com</span></div>
                <div className="text-slate-400">2. Extensions → Apps Script → paste script from <span className="text-cyan-400">google-apps-script/GoogleAppsScript.gs</span></div>
                <div className="text-slate-400">3. Deploy → New deployment → Type: Web app → Execute as: Me → Who has access: Anyone</div>
                <div className="text-slate-400">4. Copy Web App URL, paste above, and click Save Settings</div>
              </div>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="rounded-2xl bg-[#0d111d] border border-slate-800 p-6 space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 pb-2 border-b border-slate-800 m-0">
              Administrator Profile & Security
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  Admin Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full rounded-xl bg-[#090b14] border border-slate-800 p-2.5 text-xs font-sans text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full rounded-xl bg-[#090b14] border border-slate-800 p-2.5 text-xs font-sans text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>SAVE SETTINGS</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
