import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Users,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Printer,
  ChevronRight,
  Mail,
  Phone,
  FileCheck,
  Lock,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  Layers,
  Building2,
  Check,
  Download,
  QrCode,
  Copy,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getGoogleSheetUrl } from '../services/googleSheetsService'

const OFFICIAL_UPI_ID = '9404665180@centralbank'

// Official static QR codes for Grand Finale fee tiers
const FINALE_QR_MAP = {
  800: '/qr-800.jpg',
  1000: '/qr-1000.jpg',
  1200: '/qr-1200.jpg',
}

export default function FinalePayment() {
  const [searchParams] = useSearchParams()

  // URL Query Parameters from Acceptance Email
  const paramTeamId = (searchParams.get('teamId') || searchParams.get('id') || '').trim().toUpperCase()
  const paramSize = parseInt(searchParams.get('size') || searchParams.get('teamSize') || '4', 10)
  const paramTeamName = (searchParams.get('teamName') || searchParams.get('team') || '').trim()
  const paramLeadName = (searchParams.get('leadName') || searchParams.get('name') || searchParams.get('leader') || searchParams.get('leaderName') || '').trim()
  const paramLeadEmail = (searchParams.get('email') || searchParams.get('leadEmail') || '').trim()
  const paramTrack = (searchParams.get('track') || searchParams.get('selectedTrack') || searchParams.get('domain') || '').trim()
  const paramPhone = (searchParams.get('phone') || searchParams.get('leadPhone') || searchParams.get('mobile') || '').trim()
  const paramFee = parseInt(searchParams.get('fee') || searchParams.get('amount') || '0', 10)

  // State
  const [teamInput, setTeamInput] = useState(paramTeamId)
  const [teamData, setTeamData] = useState({
    teamId: paramTeamId,
    teamName: paramTeamName || 'Finalist Team',
    leadFullName: paramLeadName || 'Team Leader',
    leadEmail: paramLeadEmail || '',
    leadPhone: paramPhone || '',
    teamSize: paramSize >= 4 && paramSize <= 6 ? paramSize : 4,
    selectedTrack: paramTrack || 'General AI Track',
    round2PaymentStatus: 'Pending',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [paidInfo, setPaidInfo] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [utrInput, setUtrInput] = useState('')
  const [copiedUpi, setCopiedUpi] = useState(false)

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(OFFICIAL_UPI_ID)
    setCopiedUpi(true)
    setTimeout(() => setCopiedUpi(false), 2500)
  }

  // Calculate locked fee strictly based on team size (Team Size × ₹200: 4 = ₹800, 5 = ₹1000, 6 = ₹1200)
  const teamSize = teamData.teamSize >= 4 && teamData.teamSize <= 6 ? teamData.teamSize : (paramSize >= 4 && paramSize <= 6 ? paramSize : 4)
  const lockedFee = teamSize * 200

  // Fetch live team details from Google Sheet
  const fetchLiveTeamData = async (targetId) => {
    if (!targetId) return
    setIsLoading(true)
    setErrorMsg('')
    try {
      const sheetUrl = getGoogleSheetUrl()
      const queryUrl = `${sheetUrl}?action=getTeamDetails&teamId=${encodeURIComponent(targetId)}`
      const res = await fetch(queryUrl)
      const data = await res.json()

      if (data && data.success) {
        const liveSize = parseInt(data.teamSize, 10) || teamSize || 4
        const resolvedSize = liveSize >= 4 && liveSize <= 6 ? liveSize : 4

        setTeamData({
          teamId: data.teamId || targetId,
          registrationId: data.registrationId || '',
          teamName: data.teamName || paramTeamName || 'Finalist Team',
          leadFullName: data.leadFullName || paramLeadName || 'Team Leader',
          leadEmail: data.leadEmail || paramLeadEmail || '',
          leadPhone: data.leadPhone || paramPhone || '',
          teamSize: resolvedSize,
          selectedTrack: data.selectedTrack || paramTrack || 'General AI Track',
          round2PaymentStatus: data.round2PaymentStatus || 'Pending',
        })

        // Check if already confirmed or pending review in Google Sheets
        const status = String(data.round2PaymentStatus || '').toLowerCase()
        const isConfirmed =
          (status.includes('paid') ||
            status.includes('verified') ||
            status.includes('confirmed') ||
            status.includes('approved')) &&
          !status.includes('pending') &&
          !status.includes('hold')

        // Real UTR previously submitted to Google Sheets (Column 48)
        const rawUtr = String(data.round2PaymentUtr || '').replace("'", '').trim()
        const hasRealSubmittedUtr =
          rawUtr.length >= 6 &&
          rawUtr !== '-' &&
          !rawUtr.toLowerCase().includes('pending') &&
          !rawUtr.toLowerCase().includes('verification') &&
          !rawUtr.toLowerCase().includes('submitted')

        if (isConfirmed) {
          setPaidInfo({
            paymentId: hasRealSubmittedUtr ? rawUtr : (data.round2PaymentStatus || 'VERIFIED'),
            amount: data.round2FeeAmount || (resolvedSize * 200),
            teamId: data.teamId || targetId,
            isConfirmed: true,
          })
        } else if (hasRealSubmittedUtr) {
          // Only show under review if a real UTR was actually submitted previously
          setPaidInfo({
            paymentId: rawUtr,
            amount: data.round2FeeAmount || (resolvedSize * 200),
            teamId: data.teamId || targetId,
            isConfirmed: false,
          })
        } else {
          // Team has NOT submitted payment yet! Keep paidInfo null so QR code & payment form are visible!
          setPaidInfo(null)
        }
      } else {
        setErrorMsg('Team ID not found. Please double check the ID sent in your acceptance email.')
      }
    } catch (err) {
      console.warn('[FinalePayment] Could not fetch live team info:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (paramTeamId) {
      fetchLiveTeamData(paramTeamId)
    } else if (paramLeadEmail) {
      fetchLiveTeamData(paramLeadEmail)
    }
  }, [paramTeamId, paramLeadEmail])

  // Confirm Round 2 Payment via UPI UTR
  const handleConfirmFinalePayment = async () => {
    if (!teamData.teamId) {
      setErrorMsg('Please enter a valid Team ID to proceed.')
      return
    }

    const cleanUtr = utrInput.trim()
    if (!cleanUtr || cleanUtr.length < 6) {
      setErrorMsg('Please enter a valid 12-digit UPI UTR number from your payment receipt.')
      return
    }

    setIsPaying(true)
    setErrorMsg('')
    await syncPaymentToGoogleSheet(cleanUtr)
  }

  // Sync payment immediately to Google Sheet Column 48
  const syncPaymentToGoogleSheet = async (paymentId) => {
    try {
      const sheetUrl = getGoogleSheetUrl()
      const payload = {
        action: 'confirmRound2Payment',
        teamId: teamData.teamId,
        paymentId: paymentId,
        paymentUtr: paymentId,
        amount: lockedFee,
        ...(!teamData.teamId && teamData.leadEmail ? { leadEmail: teamData.leadEmail } : {}),
      }

      // 1. Primary: POST request with text/plain body
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        })
      } catch (postErr) {
        console.warn('[FinalePayment] Standard POST blocked or redirected, retrying no-cors:', postErr)
        try {
          await fetch(sheetUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload),
          })
        } catch (noCorsErr) {
          console.warn('[FinalePayment] no-cors POST attempt error:', noCorsErr)
        }
      }

      // 2. High-reliability GET beacon fallback:
      // Even if POST has CORS redirect limitations in strict mobile browsers, GET directly executes handleDirectRound2Confirmation
      const queryParams = new URLSearchParams({
        action: 'confirmRound2Payment',
        teamId: teamData.teamId,
        paymentUtr: paymentId,
        amount: String(lockedFee),
        ...(!teamData.teamId && teamData.leadEmail ? { leadEmail: teamData.leadEmail } : {}),
      })
      fetch(`${sheetUrl}?${queryParams.toString()}`, { mode: 'no-cors' }).catch(() => {})

      setPaidInfo({
        paymentId: paymentId,
        amount: lockedFee,
        teamId: teamData.teamId,
        isConfirmed: false,
      })
    } catch (err) {
      console.warn('[FinalePayment] Sheet sync notice:', err)
      setPaidInfo({
        paymentId: paymentId,
        amount: lockedFee,
        teamId: teamData.teamId,
        isConfirmed: false,
      })
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Official Sticky Navigation Header */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header matching root website theme */}
        <section className="text-center max-w-2xl mx-auto mb-8 space-y-2.5">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#062b59] via-[#0b3b75] to-[#062b59] text-white shadow-xs border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-white">
              AiTHON 2.0 • GRAND FINALE WORKSTATION CONFIRMATION
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-black text-[#062b59] tracking-tight uppercase">
            Grand Finale Registration
          </h1>

          {/* Supporting Text */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Your idea presentation was shortlisted for the offline Grand Finale at AVCOE Sangamner. Confirm your team workstation below.
          </p>
        </section>

        {paidInfo ? (
          /* ================================================================ */
          /* ⏱️ UNDER REVIEW VIEW: 24-HOUR MANUAL REVIEW & CONFIRMATION        */
          /* ================================================================ */
          <div className="bg-white border border-[#edebe6] rounded-2xl p-6 sm:p-10 shadow-sm text-center space-y-6 animate-fadeIn max-w-2xl mx-auto">
            {/* Glowing Clock / Review Badge */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 ${
              paidInfo.isConfirmed
                ? 'bg-emerald-100 text-emerald-600 border-emerald-300'
                : 'bg-amber-100 text-amber-600 border-amber-300'
            }`}>
              {paidInfo.isConfirmed ? (
                <CheckCircle className="w-10 h-10 stroke-[2.5]" />
              ) : (
                <Clock className="w-10 h-10 stroke-[2.5]" />
              )}
            </div>

            {/* Header Text */}
            <div className="space-y-1.5 text-center">
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                paidInfo.isConfirmed
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-amber-700 bg-amber-50 border-amber-200'
              }`}>
                {paidInfo.isConfirmed
                  ? 'PAYMENT CONFIRMED • SEAT LOCKED'
                  : 'SUBMISSION UNDER REVIEW • 24 HOURS'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#062b59] uppercase tracking-tight">
                {paidInfo.isConfirmed
                  ? 'Grand Finale Seat Confirmed!'
                  : 'We will review your payment shortly in 24hr will get confirmation'}
              </h2>
              <p className="text-sm text-slate-600 font-medium max-w-md mx-auto">
                {paidInfo.isConfirmed
                  ? 'Your payment was officially approved by the organizing committee.'
                  : 'Your Grand Finale fee submission and 12-digit UTR have been received.'}
              </p>
            </div>

            {/* Prominent 24-Hour Review Banner */}
            {!paidInfo.isConfirmed ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 border-2 border-amber-300 text-left space-y-2 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-amber-950 uppercase tracking-tight">
                      We will review your payment shortly in 24hr will get confirmation
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
                      Your 12-digit UTR (<strong className="font-mono text-amber-950">{paidInfo.paymentId}</strong>) for the Grand Finale workstation fee of <strong className="font-bold text-amber-950">₹{paidInfo.amount}</strong> has been received. Our organizing committee is manually reviewing your payment against bank records.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-left space-y-2 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-emerald-950 uppercase tracking-tight">
                      Payment Confirmed & Verified by Organizing Committee
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-900 font-medium leading-relaxed">
                      Your workstation for <strong>{teamSize} members</strong> has been officially locked for the offline Grand Finale at AVCOE Sangamner.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Ticket Notice - Only visible once payment is confirmed */}
            {paidInfo.isConfirmed && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left space-y-1 text-xs text-emerald-950">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Grand Finale Hall Ticket & Workstation Entry Pass Dispatched</span>
                </div>
                <p className="text-[11.5px] text-emerald-800 pl-5 leading-relaxed">
                  Your official printable <strong>Grand Finale Hall Ticket & Workstation Entry Pass</strong> has been emailed to: <strong className="text-emerald-950 font-mono">{teamData.leadEmail || 'your email'}</strong>.
                </p>
              </div>
            )}

            {/* Submission Summary Card */}
            <div className="p-5 rounded-2xl bg-[#faf9f6] border border-[#edebe6] text-left space-y-3 shadow-2xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#edebe6] text-xs">
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Team ID</span>
                  <span className="text-base sm:text-lg font-black text-[#ea580c] font-mono tracking-tight">
                    {teamData.teamId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Team Name</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#062b59]">
                    {teamData.teamName}
                  </span>
                </div>
              </div>

              <div className="pb-3 border-b border-[#edebe6] text-xs">
                <span className="text-slate-400 block font-bold text-[11px] uppercase">Competition Track</span>
                <span className="text-sm font-extrabold text-[#062b59] flex items-center gap-1.5 mt-0.5">
                  <Layers className="w-4 h-4 text-[#2563eb] shrink-0" />
                  <span>{teamData.selectedTrack}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Grand Finale Fee</span>
                  <span className="font-extrabold text-[#062b59] text-sm">
                    ₹{paidInfo.amount} ({teamSize} Members)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Payment Status</span>
                  {paidInfo.isConfirmed ? (
                    <span className="font-bold text-emerald-700 flex items-center gap-1 text-xs sm:text-sm">
                      <CheckCircle className="w-3.5 h-3.5" /> Confirmed • Workstation Locked
                    </span>
                  ) : (
                    <span className="font-bold text-amber-700 flex items-center gap-1 text-xs sm:text-sm">
                      <Clock className="w-3.5 h-3.5" /> Under Review (Pending Verification)
                    </span>
                  )}
                </div>
              </div>

              {paidInfo.paymentId && (
                <div className="pt-2 text-xs border-t border-[#edebe6] flex items-center justify-between">
                  <span className="text-slate-400 font-bold text-[11px] uppercase">Submitted UTR</span>
                  <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-[#edebe6]">
                    {paidInfo.paymentId}
                  </span>
                </div>
              )}
            </div>

            {/* Reporting & Venue Section */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 text-left">
              <div className="flex items-center gap-2 font-bold text-[#062b59]">
                <MapPin className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>Dept. of AI & DS, AVCOE Sangamner, Ahmednagar, MH - 422608</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px] font-medium pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2563eb]" /> Friday, 23 October 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2563eb]" /> 08:30 AM IST Sharp
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {!paidInfo.isConfirmed && (
                <button
                  type="button"
                  onClick={() => setPaidInfo(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  ✏️ Edit / Re-enter Payment UTR
                </button>
              )}

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#faf9f6] hover:bg-white text-slate-700 border border-[#edebe6] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Print / Save Slip
              </button>

              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 text-center shadow-xs cursor-pointer"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        ) : (
          /* ================================================================ */
          /* 💳 CANDIDATE PROFILE & PAYMENT ACTION VIEW                       */
          /* ================================================================ */
          <div className="space-y-6">
            {/* Error Message banner */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* If no Team ID in URL, prompt to lookup */}
            {!teamData.teamId && (
              <div className="bg-white border border-[#edebe6] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#062b59]">
                  <Lock className="w-4 h-4 text-[#ea580c]" />
                  <span>Enter Team ID From Your Acceptance Email:</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={teamInput}
                    onChange={(e) => setTeamInput(e.target.value.toUpperCase())}
                    placeholder="e.g. TEAM-101"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
                  />
                  <button
                    type="button"
                    onClick={() => fetchLiveTeamData(teamInput)}
                    disabled={isLoading || !teamInput.trim()}
                    className="px-6 py-2.5 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Team'}
                  </button>
                </div>
              </div>
            )}

            {/* Main Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Left Column: Team Profile Details (3 Cols) */}
              <div className="md:col-span-3 bg-white border border-[#edebe6] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#edebe6]">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#062b59]">
                    <Users className="w-4 h-4 text-[#2563eb]" />
                    <span>Shortlisted Team Profile</span>
                  </div>
                  <span className="font-mono text-xs font-black text-[#ea580c] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                    {teamData.teamId || 'TEAM-XXX'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Team Name</span>
                    <strong className="text-slate-900 text-sm font-bold block mt-0.5">
                      {teamData.teamName}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Team Leader</span>
                    <strong className="text-slate-900 text-sm font-bold block mt-0.5">
                      {teamData.leadFullName}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Leader Email</span>
                    <strong className="text-slate-700 font-mono text-xs block mt-0.5">
                      {teamData.leadEmail || '—'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Competition Track</span>
                    <strong className="text-[#2563eb] font-bold block mt-0.5">
                      {teamData.selectedTrack}
                    </strong>
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-[#edebe6]">
                    <span className="text-slate-500 font-medium block">Verified Team Size</span>
                    <strong className="text-emerald-700 font-extrabold text-sm block mt-0.5">
                      {teamSize} Registered Members
                    </strong>
                  </div>
                </div>

                {/* Information Callout */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                  <span>
                    The Grand Finale fee is strictly non-editable and locked to <strong>{teamSize} Members × ₹200 = ₹{lockedFee}</strong>. Completing this step confirms your team workstation, hackathon kit, and event credentials.
                  </span>
                </div>
              </div>

              {/* Right Column: Amount Locked & UPI Payment (2 Cols) */}
              <div className="md:col-span-2 bg-gradient-to-br from-white via-white to-orange-50/30 border border-[#edebe6] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#edebe6]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#ea580c] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                      Amount Locked
                    </span>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 font-medium">Grand Finale Fee</div>
                    <div className="text-4xl sm:text-5xl font-black text-[#062b59] tracking-tight mt-1">
                      ₹{lockedFee}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      Calculated: {teamSize} Members × ₹200 (Total team entry)
                    </p>
                  </div>

                  {/* QR Code & UPI Details */}
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center space-y-3">
                    <div className="inline-block p-3 sm:p-4 bg-white rounded-2xl border-2 border-blue-300 shadow-md">
                      <img
                        src={FINALE_QR_MAP[lockedFee] || '/qr-800.jpg'}
                        alt={`Scan to pay ₹${lockedFee} via UPI - Shree A. Ugale (${OFFICIAL_UPI_ID})`}
                        className="w-56 h-auto sm:w-64 md:w-72 max-w-full mx-auto rounded-xl object-contain shadow-xs"
                        loading="eager"
                      />
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 font-bold text-[10px] uppercase block">Official UPI ID</span>
                      <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-blue-200 text-xs font-mono font-bold text-[#062b59]">
                        <span>{OFFICIAL_UPI_ID}</span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="text-[#2563eb] hover:text-[#062b59] p-0.5 cursor-pointer"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* UTR Entry Field */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#062b59] block">
                      Enter 12-Digit UPI UTR / Reference ID *
                    </label>
                    <input
                      type="text"
                      value={utrInput}
                      onChange={(e) => setUtrInput(e.target.value)}
                      placeholder="e.g. 12-digit UTR from GPay / PhonePe / Paytm"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#edebe6] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-xs font-mono font-bold text-slate-800 transition-all"
                    />
                    <span className="text-[10.5px] text-slate-500 block">
                      Pay ₹{lockedFee} to the QR/UPI above and paste the 12-digit UTR receipt number here.
                    </span>
                  </div>
                </div>

                {/* Confirm Button */}
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={handleConfirmFinalePayment}
                    disabled={isPaying || isLoading || !teamData.teamId}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isPaying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting for 24-Hr Review...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirm ₹{lockedFee} Payment & Lock Workstation</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="text-center text-[10.5px] text-slate-500 flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>We will review your payment shortly in 24hr will get confirmation.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Offline Venue Information Card */}
            <div className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center shrink-0 border border-blue-100">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-[#062b59]">Event Date</div>
                  <div className="text-slate-600 mt-0.5 font-medium">Friday, 23 October 2026</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-[#062b59]">Reporting Time</div>
                  <div className="text-slate-600 mt-0.5 font-medium">08:30 AM IST Sharp</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#ea580c] flex items-center justify-center shrink-0 border border-orange-100">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-[#062b59]">Venue</div>
                  <div className="text-slate-600 mt-0.5 font-medium">Dept. of AI & DS, AVCOE Sangamner</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Official Footer matching root website */}
      <Footer />
    </div>
  )
}
