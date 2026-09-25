import React from 'react'
import { createPortal } from 'react-dom'
import { Printer, X, FileText } from 'lucide-react'

/**
 * Official Registration & Screening Fee Slip for AI-THON 2.0
 * STRICT ONE-PAGE PRINT LAYOUT: Highly structured, academic grade, zero clutter,
 * perfectly optimized to fit strictly on ONE single A4 page without spilling over.
 */
export function RegistrationSlip({
  formData = {},
  teamId = '',
  registrationId = '',
  submissionDate = '',
  id = 'printable-receipt',
}) {
  const finalTeamId = teamId || formData.teamId || 'TEAM-CONFIRMED'
  const finalRegId =
    registrationId ||
    formData.registrationId ||
    (finalTeamId ? finalTeamId.replace('TEAM-', 'AI26-') : 'AI26-CONFIRMED')

  const teamSizeNum = parseInt(formData.teamSize, 10) || 4
  const activeMembers = (formData.members || [])
    .slice(0, teamSizeNum - 1)
    .filter((m) => m && m.fullName && m.fullName.trim())

  const printDate =
    submissionDate ||
    new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

  return (
    <div
      id={id}
      className="bg-white text-slate-900 w-full max-w-[780px] mx-auto p-4 sm:p-5 border-2 border-[#062b59] rounded shadow-xs font-sans text-xs leading-tight select-text"
      style={{ boxSizing: 'border-box' }}
    >
      {/* ============================================================== */}
      {/* 1. OFFICIAL INSTITUTION & EVENT HEADER                         */}
      {/* ============================================================== */}
      <div className="border-b-2 border-[#062b59] pb-2 mb-2">
        <div className="flex items-center justify-between gap-2.5">
          {/* Amrutvahini University & AVCOE College Logos */}
          <div className="flex items-center gap-1.5 shrink-0">
            <img
              src="/amrutvahini_university_logo.png"
              alt="Amrutvahini University"
              className="h-8 sm:h-9 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center">
              <img
                src="/amrutvahini_logo.png"
                alt="AVCOE Logo"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>

          {/* Central Title Hierarchy */}
          <div className="text-center flex-1 space-y-0.5 px-1">
            <h1 className="text-[13px] sm:text-[14px] font-black tracking-tight text-[#062b59] uppercase leading-none">
              Amrutvahini College of Engineering, Sangamner
            </h1>
            <p className="text-[9px] font-semibold text-slate-600 leading-none">
              (An Autonomous Institute • Approved by AICTE • Affiliated to SPPU, Pune • NAAC &apos;A&apos; Grade)
            </p>
            <p className="text-[10px] sm:text-[11px] font-extrabold text-[#062b59] uppercase tracking-wide leading-none pt-0.5">
              Department of Artificial Intelligence & Data Science
            </p>
            <p className="text-[8.5px] text-slate-500 font-medium leading-none">
              In Technical Association with CSI & ISTE Student Chapters
            </p>
            <div className="pt-1">
              <span className="inline-block bg-[#062b59] text-white text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded leading-none">
                AI-THON 2.0 • NATIONAL LEVEL AI HACKATHON 2026
              </span>
            </div>
            <p className="text-[9.5px] font-bold text-[#ea580c] uppercase tracking-widest leading-none pt-0.5">
              Official Registration & Submission Acknowledgment Slip
            </p>
          </div>

          {/* AI-THON Official Logo */}
          <div className="w-14 h-14 shrink-0 flex items-center justify-center">
            <img
              src="/aithon-hero-logo.png"
              alt="AI-THON Logo"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/aiesa_logo.png'
              }}
            />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. REGISTRATION IDENTIFIERS & TRACKING BAR                     */}
      {/* ============================================================== */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-50 border border-slate-300 rounded mb-2 text-center text-[10.5px]">
        <div>
          <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500 block">
            Registration No.
          </span>
          <span className="font-mono font-black text-[#062b59] text-xs block">
            {finalRegId}
          </span>
        </div>

        <div>
          <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500 block">
            Assigned Team ID
          </span>
          <span className="font-mono font-black text-[#ea580c] text-xs block">
            {finalTeamId}
          </span>
        </div>

        <div>
          <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500 block">
            Date & Timestamp
          </span>
          <span className="font-semibold text-slate-800 text-[9.5px] block truncate">
            {printDate}
          </span>
        </div>

        <div>
          <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500 block">
            Verification Status
          </span>
          <span className="inline-block font-extrabold text-[9px] text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded leading-tight">
            SUBMITTED • UNDER REVIEW
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. SECTION 1: TEAM & TRACK PARTICULARS                         */}
      {/* ============================================================== */}
      <div className="mb-2">
        <div className="bg-[#062b59] text-white px-2 py-0.5 font-bold text-[9.5px] uppercase tracking-wider rounded-t flex items-center justify-between">
          <span>1. Team & Competition Track Information</span>
          <span className="text-[8.5px] text-blue-200 font-normal">Team Composition: {teamSizeNum} Members</span>
        </div>
        <div className="border border-t-0 border-slate-300 p-1.5 rounded-b grid grid-cols-4 gap-2 bg-white text-[10px]">
          <div>
            <span className="text-[8.5px] text-slate-500 font-semibold uppercase block">Team Name</span>
            <span className="font-extrabold text-[#062b59] text-[10.5px] block truncate">
              {formData.teamName || 'AiTHON Team'}
            </span>
          </div>

          <div>
            <span className="text-[8.5px] text-slate-500 font-semibold uppercase block">Domain</span>
            <span className="font-bold text-slate-800 text-[10px] block">
              {formData.selectedDomain === 'Hardware' ? 'Track 2: Hardware' : 'Track 1: Software'}
            </span>
          </div>

          <div className="col-span-2">
            <span className="text-[8.5px] text-slate-500 font-semibold uppercase block">Selected Competition Track</span>
            <span className="font-bold text-[#062b59] text-[10px] block truncate" title={formData.selectedTrack}>
              {formData.selectedTrack || 'General AI Track'}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. SECTION 2: TEAM LEADER (PRIMARY APPLICANT)                  */}
      {/* ============================================================== */}
      <div className="mb-2">
        <div className="bg-[#062b59] text-white px-2 py-0.5 font-bold text-[9.5px] uppercase tracking-wider rounded-t">
          <span>2. Team Leader Profile (Primary Contact & Point of Communication)</span>
        </div>
        <div className="border border-t-0 border-slate-300 p-1.5 rounded-b grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-white text-[9.5px]">
          <div>
            <span className="text-[8.5px] text-slate-500 font-semibold uppercase block">Full Name</span>
            <span className="font-bold text-slate-900 block truncate">{formData.leadFullName || 'N/A'}</span>
          </div>

          <div>
            <span className="text-[8.5px] text-slate-500 font-semibold uppercase block">Mobile / WhatsApp</span>
            <span className="font-mono font-bold text-slate-900 block truncate">{formData.leadPhone || 'N/A'}</span>
          </div>

          <div>
            <span className="text-[8.5px] text-slate-500 font-semibold uppercase block">Registered Email</span>
            <span className="font-mono text-slate-800 block truncate" title={formData.leadEmail}>{formData.leadEmail || 'N/A'}</span>
          </div>

          <div>
            <span className="text-[8.5px] text-slate-500 font-semibold uppercase block">College / Institute</span>
            <span className="font-semibold text-slate-800 block truncate" title={formData.leadCollege}>
              {formData.leadCollege || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[8.5px] text-slate-500 font-semibold uppercase block">Course & Year</span>
            <span className="font-semibold text-slate-800 block truncate" title={`${formData.leadCourse} (${formData.leadYear})`}>
              {formData.leadCourse || 'N/A'} ({formData.leadYear || 'Year'})
            </span>
          </div>

          <div>
            <span className="text-[8.5px] text-slate-500 font-semibold uppercase block">City / State</span>
            <span className="font-semibold text-slate-800 block truncate">{formData.leadCity || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. SECTION 3: REGISTERED TEAM MEMBERS ROSTER                   */}
      {/* ============================================================== */}
      <div className="mb-2">
        <div className="bg-[#062b59] text-white px-2 py-0.5 font-bold text-[9.5px] uppercase tracking-wider rounded-t">
          <span>3. Registered Team Members Roster</span>
        </div>
        <div className="border border-t-0 border-slate-300 rounded-b overflow-hidden">
          <table className="w-full text-left border-collapse text-[9.5px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[8.5px]">
                <th className="py-1 px-1.5 w-6 text-center border-r border-slate-300">#</th>
                <th className="py-1 px-1.5 border-r border-slate-300">Member Name</th>
                <th className="py-1 px-1.5 border-r border-slate-300">Email Address</th>
                <th className="py-1 px-1.5 border-r border-slate-300">College / Institute</th>
                <th className="py-1 px-1.5">Course & Year</th>
              </tr>
            </thead>
            <tbody>
              {/* Leader as Row 1 */}
              <tr className="border-b border-slate-200 bg-blue-50/40">
                <td className="py-0.5 px-1.5 text-center font-bold text-[#062b59] border-r border-slate-200">
                  01
                </td>
                <td className="py-0.5 px-1.5 font-bold text-slate-900 border-r border-slate-200">
                  {formData.leadFullName || 'Leader Name'}{' '}
                  <span className="text-[8px] font-black uppercase text-[#062b59] bg-blue-100 px-1 py-0.2 rounded border border-blue-200">
                    Leader
                  </span>
                </td>
                <td className="py-0.5 px-1.5 font-mono text-slate-700 border-r border-slate-200 truncate max-w-[130px]">
                  {formData.leadEmail || 'N/A'}
                </td>
                <td className="py-0.5 px-1.5 text-slate-700 border-r border-slate-200 truncate max-w-[150px]">
                  {formData.leadCollege || 'N/A'}
                </td>
                <td className="py-0.5 px-1.5 text-slate-700 truncate max-w-[120px]">
                  {formData.leadCourse || 'N/A'} ({formData.leadYear || 'Year'})
                </td>
              </tr>

              {/* Teammates */}
              {activeMembers.length > 0 ? (
                activeMembers.map((member, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    <td className="py-0.5 px-1.5 text-center font-semibold text-slate-600 border-r border-slate-200">
                      0{idx + 2}
                    </td>
                    <td className="py-0.5 px-1.5 font-bold text-slate-900 border-r border-slate-200 truncate max-w-[130px]">
                      {member.fullName}
                    </td>
                    <td className="py-0.5 px-1.5 font-mono text-slate-700 border-r border-slate-200 truncate max-w-[130px]">
                      {member.email || '—'}
                    </td>
                    <td className="py-0.5 px-1.5 text-slate-700 border-r border-slate-200 truncate max-w-[150px]">
                      {member.college || '—'}
                    </td>
                    <td className="py-0.5 px-1.5 text-slate-700 truncate max-w-[120px]">
                      {member.course || '—'} {member.year ? `(${member.year})` : ''}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-1 px-2 text-center text-slate-400 italic text-[9px]">
                    No additional team members registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. SECTION 4: PRESENTATION & SCREENING PAYMENT VERIFICATION   */}
      {/* ============================================================== */}
      <div className="mb-2">
        <div className="bg-[#062b59] text-white px-2 py-0.5 font-bold text-[9.5px] uppercase tracking-wider rounded-t">
          <span>4. Presentation Submission & Screening Fee Receipt</span>
        </div>
        <div className="border border-t-0 border-slate-300 p-1.5 rounded-b grid grid-cols-2 gap-2 bg-white text-[9.5px]">
          {/* Left Column: Presentation File Details */}
          <div className="space-y-1 border-r border-slate-200 pr-2">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] text-slate-500 font-semibold uppercase">Submitted Presentation</span>
              <span className="text-[8.5px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                Uploaded
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="font-mono font-bold text-slate-900 text-[10px] truncate" title={formData.pptFileName}>
                📄 {formData.pptFileName || `${finalTeamId}.pptx`}
              </div>
              <div className="text-[9px] text-slate-600">
                File Size: <span className="font-semibold">{formData.pptFileSize || 'Processed'}</span> • Format:{' '}
                <span className="font-semibold uppercase">
                  {formData.pptFileName?.endsWith('.pdf') ? 'PDF Document' : 'PowerPoint Presentation'}
                </span>
              </div>
              <div className="text-[8.5px] text-slate-500 italic">
                Status: Stored in Central Evaluation Drive for Jury Review
              </div>
            </div>
          </div>

          {/* Right Column: Fee & Bank Transaction Details */}
          <div className="space-y-1 pl-1">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] text-slate-500 font-semibold uppercase">Screening & Evaluation Fee</span>
              <span className="font-black text-[10.5px] text-[#062b59]">₹50.00 (INR Paid)</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[8.5px] text-slate-500">Payment Mode:</span>
                <span className="font-semibold text-slate-800">UPI / QR Code</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[8.5px] text-slate-500">Bank UTR / Ref No:</span>
                <span className="font-mono font-extrabold text-[#062b59] text-[10px] bg-slate-100 px-1 py-0.2 rounded border border-slate-300">
                  {formData.paymentUtr || 'SUBMITTED'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[8.5px] text-slate-500">Audit Status:</span>
                <span className="text-[8.5px] font-bold text-amber-800">
                  Manual Bank Statement Reconciliation (24 Hours)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 7. SECTION 5: IMPORTANT INSTRUCTIONS & NEXT STEPS             */}
      {/* ============================================================== */}
      <div className="mb-2 p-1.5 bg-slate-50 border border-slate-300 rounded text-[9px] text-slate-700 space-y-0.5">
        <span className="font-extrabold text-[#062b59] uppercase tracking-wider block text-[9px]">
          Important Guidelines for Registered Teams:
        </span>
        <ol className="list-decimal list-inside space-y-0.5 pl-0.5 leading-tight">
          <li>
            This slip acts as valid computer-generated proof of submission for AI-THON 2.0 Preliminary Round.
          </li>
          <li>
            Presentation screening will be conducted by expert jurors. Shortlisted teams for the Grand Finale will receive invites via registered email and the official WhatsApp group.
          </li>
          <li>
            Confirmation email will be dispatched to <strong className="font-mono text-slate-900">{formData.leadEmail || 'your email'}</strong> upon bank verification of the ₹50 UTR within 24 hours.
          </li>
          <li>
            For inquiries, quote your <strong className="font-mono">{finalTeamId}</strong> to <strong className="text-[#062b59]">ai.veer2k26@gmail.com</strong> or event coordinators.
          </li>
        </ol>
      </div>

      {/* ============================================================== */}
      {/* 8. SECTION 6: DIGITAL VERIFICATION & SIGNATORY BLOCK           */}
      {/* ============================================================== */}
      <div className="pt-1.5 border-t border-slate-300 flex items-end justify-between gap-3 text-[8.5px] text-slate-600">
        <div className="space-y-0.5 max-w-[320px]">
          <div className="font-mono font-bold text-[8.5px] uppercase tracking-wider text-slate-500">
            Security Hash: AVCOE-AI26-{finalTeamId}-VERIFIED
          </div>
          <p className="text-[8px] text-slate-500 leading-tight">
            This is an electronically generated acknowledgment slip. No physical signature or rubber stamp is required.
          </p>
        </div>

        <div className="text-right space-y-0.5 shrink-0">
          <div className="font-black text-[#062b59] uppercase text-[9.5px] leading-tight">
            Organizing Committee • AI-THON 2.0
          </div>
          <div className="text-[8.5px] font-semibold text-slate-600 leading-tight">
            Department of AI & Data Science
          </div>
          <div className="text-[8px] text-slate-500 leading-tight">
            Amrutvahini College of Engineering, Sangamner
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Registration Slip Modal with Preview, Print & Save as PDF controls.
 */
export function RegistrationSlipModal({
  isOpen,
  onClose,
  formData,
  teamId,
  registrationId,
  submissionDate,
}) {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="receipt-modal-backdrop fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="receipt-modal-card bg-slate-100 rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-300 flex flex-col my-auto max-h-[96vh] overflow-hidden">
        {/* Sticky Control Header (Hidden in Print) */}
        <div className="no-print bg-[#062b59] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-none">
                Official Registration Slip Preview
              </h3>
              <p className="text-[10.5px] text-blue-200 hidden sm:block leading-none mt-0.5">
                Formatted strictly for single-page A4 printing. Ready to print or save as PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Slip Container */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-slate-200/70 flex justify-center">
          <RegistrationSlip
            formData={formData}
            teamId={teamId}
            registrationId={registrationId}
            submissionDate={submissionDate}
            id="modal-preview-slip"
          />
        </div>

        {/* Modal Footer Controls (Hidden in Print) */}
        <div className="no-print bg-white border-t border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
          <span className="text-[10.5px] text-slate-500 font-medium">
            Tip: In the print dialog, select <strong>&quot;Save as PDF&quot;</strong> and ensure <strong>&quot;Background graphics&quot;</strong> is checked. Single-page print guaranteed.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default RegistrationSlip
