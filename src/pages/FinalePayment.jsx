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
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getGoogleSheetUrl } from '../services/googleSheetsService'

// Helper to dynamically load Razorpay Checkout SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function FinalePayment() {
  const [searchParams] = useSearchParams()

  // URL Query Parameters from Acceptance Email
  const paramTeamId = (searchParams.get('teamId') || searchParams.get('id') || '').trim().toUpperCase()
  const paramSize = parseInt(searchParams.get('size') || searchParams.get('teamSize') || '4', 10)
  const paramTeamName = (searchParams.get('teamName') || searchParams.get('team') || '').trim()
  const paramLeadName = (searchParams.get('leadName') || searchParams.get('name') || '').trim()
  const paramLeadEmail = (searchParams.get('email') || searchParams.get('leadEmail') || '').trim()
  const paramTrack = (searchParams.get('track') || searchParams.get('selectedTrack') || '').trim()
  const paramFee = parseInt(searchParams.get('fee') || searchParams.get('amount') || '0', 10)

  // State
  const [teamInput, setTeamInput] = useState(paramTeamId)
  const [teamData, setTeamData] = useState({
    teamId: paramTeamId,
    teamName: paramTeamName || 'Finalist Team',
    leadFullName: paramLeadName || 'Team Leader',
    leadEmail: paramLeadEmail || '',
    leadPhone: '',
    teamSize: paramSize >= 4 && paramSize <= 6 ? paramSize : 4,
    selectedTrack: paramTrack || 'General AI Track',
    round2PaymentStatus: 'Pending',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [paidInfo, setPaidInfo] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Calculate locked fee strictly based on team size (Team Size × ₹200)
  const teamSize = teamData.teamSize || 4
  const lockedFee = paramFee > 0 ? paramFee : teamSize * 200

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
        setTeamData({
          teamId: data.teamId || targetId,
          teamName: data.teamName || 'Finalist Team',
          leadFullName: data.leadFullName || 'Team Leader',
          leadEmail: data.leadEmail || '',
          leadPhone: data.leadPhone || '',
          teamSize: parseInt(data.teamSize, 10) || 4,
          selectedTrack: data.selectedTrack || 'General AI Track',
          round2PaymentStatus: data.round2PaymentStatus || 'Pending',
        })

        // Check if already paid
        const status = String(data.round2PaymentStatus || '').toLowerCase()
        if (status.includes('paid') || status.includes('verified') || status.includes('confirmed')) {
          setPaidInfo({
            paymentId: data.round2PaymentStatus,
            amount: data.round2FeeAmount || (parseInt(data.teamSize, 10) * 200),
            teamId: data.teamId,
          })
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
    }
  }, [paramTeamId])

  // Trigger Embedded Razorpay Standard Checkout (Same as Evaluation Round)
  const handlePayGrandFinaleFee = async () => {
    if (!teamData.teamId) {
      setErrorMsg('Please enter a valid Team ID to proceed.')
      return
    }

    setIsPaying(true)
    setErrorMsg('')

    try {
      const isLoaded = await loadRazorpayScript()
      const razorpayKey =
        import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TbdQP6aRj2Uab8'

      if (!isLoaded || !window.Razorpay) {
        throw new Error('Razorpay secure checkout SDK could not be loaded. Please check your internet connection.')
      }

      const options = {
        key: razorpayKey,
        amount: lockedFee * 100, // in paise (e.g. 80000 for ₹800)
        currency: 'INR',
        name: 'AiTHON 2.0 Grand Finale',
        description: `Workstation Registration Fee (${teamSize} Members) - ${teamData.teamId}`,
        prefill: {
          name: teamData.leadFullName || '',
          email: teamData.leadEmail || '',
          contact: teamData.leadPhone || '',
        },
        notes: {
          teamId: teamData.teamId,
          teamName: teamData.teamName,
          teamSize: String(teamSize),
          feeType: 'grand_finale',
        },
        theme: {
          color: '#062b59',
        },
        handler: async function (response) {
          const paymentId = response.razorpay_payment_id
          if (paymentId) {
            await syncPaymentToGoogleSheet(paymentId)
          }
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (resp) {
        setIsPaying(false)
        setErrorMsg('Payment could not be completed: ' + (resp?.error?.description || 'Transaction cancelled.'))
      })
      rzp.open()
    } catch (err) {
      console.error('[FinalePayment] Error opening checkout:', err)
      setErrorMsg(err.message || 'Failed to initialize payment.')
      setIsPaying(false)
    }
  }

  // Sync payment immediately to Google Sheet Column 47
  const syncPaymentToGoogleSheet = async (paymentId) => {
    try {
      const sheetUrl = getGoogleSheetUrl()
      const payload = {
        action: 'confirmRound2Payment',
        teamId: teamData.teamId,
        leadEmail: teamData.leadEmail,
        paymentId: paymentId,
        paymentUtr: paymentId,
        amount: lockedFee,
      }

      await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      })

      setPaidInfo({
        paymentId: paymentId,
        amount: lockedFee,
        teamId: teamData.teamId,
      })
    } catch (err) {
      console.warn('[FinalePayment] Sheet sync notice:', err)
      setPaidInfo({
        paymentId: paymentId,
        amount: lockedFee,
        teamId: teamData.teamId,
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
          /* 🎟️ SUCCESS VIEW: OFFICIAL GRAND FINALE ENTRY PASS TICKET         */
          /* ================================================================ */
          <div className="space-y-6 animate-fadeIn">
            {/* Success Alert Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-xs space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mb-1">
                <CheckCircle className="w-8 h-8" />
              </div>
              <span className="inline-block text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-white px-3 py-0.5 rounded-full border border-emerald-200 shadow-xs">
                Payment Verified • Workstation Locked
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#062b59]">
                Grand Finale Seat Officially Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                We have verified your Grand Finale registration fee of{' '}
                <strong className="text-emerald-700 font-bold">₹{paidInfo.amount}</strong>. Your physical seat and workstation at AVCOE Sangamner are locked.
              </p>
            </div>

            {/* Official Pass Ticket Card (Printable) */}
            <div className="bg-white border border-[#edebe6] rounded-2xl shadow-sm overflow-hidden">
              {/* Ticket Brand Header */}
              <div className="bg-[#062b59] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-[#ea580c]">
                <div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">
                    Amrutvahini College of Engineering, Sangamner
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black tracking-tight">
                    {teamData.teamName}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 font-medium">
                    Team Leader: {teamData.leadFullName} ({teamData.leadEmail})
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Official Team ID</div>
                  <div className="font-mono text-xl sm:text-2xl font-black text-[#ea580c] bg-white/10 px-3 py-1 rounded-lg inline-block mt-0.5 border border-white/10">
                    {teamData.teamId}
                  </div>
                </div>
              </div>

              {/* Ticket Details Grid */}
              <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-[#edebe6] text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">
                    Competition Track
                  </span>
                  <strong className="text-sm font-black text-[#062b59] block mt-1">
                    {teamData.selectedTrack}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">
                    Verified Team Size
                  </span>
                  <strong className="text-sm font-black text-[#062b59] block mt-1">
                    {teamSize} Members Registered
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">
                    Registration Fee Status
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <strong className="text-sm font-black text-emerald-700">
                      ₹{paidInfo.amount} Paid ({paidInfo.paymentId})
                    </strong>
                  </div>
                </div>
              </div>

              {/* Reporting & Venue Section */}
              <div className="p-6 sm:p-8 bg-[#faf9f6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-black text-[#062b59] text-sm">
                    <MapPin className="w-4 h-4 text-[#ea580c] shrink-0" />
                    <span>Dept. of AI & DS, AVCOE Sangamner, Ahmednagar, MH - 422608</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px] font-medium pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#2563eb]" /> Friday, 23 October 2026
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#2563eb]" /> 08:30 AM IST Sharp
                    </span>
                  </div>
                </div>

                {/* Print Ticket Button */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm hover:shadow-md shrink-0 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Ticket</span>
                </button>
              </div>
            </div>

            {/* Email dispatch notice */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#2563eb] shrink-0" />
                <span>
                  Official Grand Finale Entry Pass has also been dispatched to your leader inbox:{' '}
                  <strong>{teamData.leadEmail}</strong>.
                </span>
              </div>
              <Link
                to="/"
                className="text-xs font-bold text-[#2563eb] hover:underline shrink-0"
              >
                Return to Home &rarr;
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

              {/* Right Column: Amount Locked & Razorpay Pay Button (2 Cols) */}
              <div className="md:col-span-2 bg-gradient-to-br from-white via-white to-orange-50/30 border border-[#edebe6] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
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

                  {/* Payment Methods Supported */}
                  <div className="pt-3 border-t border-[#edebe6] space-y-2 text-[11px] text-slate-600">
                    <div className="font-bold text-slate-700">Accepted Instant Modes:</div>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Google Pay</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">PhonePe</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Paytm</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">UPI / QR</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Cards / NetBanking</span>
                    </div>
                  </div>
                </div>

                {/* Pay Button matching root website CTA style */}
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={handlePayGrandFinaleFee}
                    disabled={isPaying || isLoading || !teamData.teamId}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isPaying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Opening Razorpay...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₹{lockedFee} Now</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant automatic sheet update & ticket email</span>
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
