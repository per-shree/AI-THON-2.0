import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Cpu,
  Laptop,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  MapPin,
  Check,
  HelpCircle,
  X,
  ExternalLink,
  FileCheck,
} from 'lucide-react'
import { TRACK_OPTIONS, DOMAIN_OPTIONS } from '../pages/Registration'

export default function RegistrationInstructions({ onProceed, rulesAgreed, setRulesAgreed }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Prevent background scrolling when confirmation modal is visible
  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showConfirmModal])

  const getCategoryForTrack = (trackName) => {
    const lower = trackName.toLowerCase()
    if (lower.includes('healthcare') || lower.includes('dental') || lower.includes('pharmacy') || lower.includes('mental health')) {
      return 'Healthcare & Science'
    }
    if (lower.includes('robotics') || lower.includes('space') || lower.includes('energy') || lower.includes('cybersecurity') || lower.includes('ui/ux')) {
      return 'Tech & Robotics'
    }
    if (lower.includes('fintech') || lower.includes('retail') || lower.includes('supply chain') || lower.includes('legaltech')) {
      return 'Finance & Commerce'
    }
    if (lower.includes('smart cities') || lower.includes('disaster') || lower.includes('agritech') || lower.includes('environmental') || lower.includes('social') || lower.includes('edtech') || lower.includes('hospitality') || lower.includes('storytelling')) {
      return 'Civic & Environment'
    }
    return 'Open Domain'
  }

  // Handle clicking "I Agree & Proceed"
  const handleProceedClick = () => {
    if (!rulesAgreed) {
      setValidationError('Please mark the agreement checkbox acknowledging that you have read the rulebook.')
    } else {
      setValidationError('')
    }
    // Always trigger the confirmation modal to explicitly verify: "ask that i read rulebook and agree with it"
    setShowConfirmModal(true)
  }

  // Handle final modal confirmation
  const handleConfirmAgreement = () => {
    setRulesAgreed(true)
    setShowConfirmModal(false)
    if (onProceed) {
      onProceed()
    }
  }

  const ruleBookItems = [
    {
      num: '01',
      title: 'Academic Eligibility (UG & Diploma Only)',
      content:
        'AITHON 2.0 is strictly restricted to active Undergraduate (UG) and Polytechnic / Technical Diploma students from recognized colleges or universities across India. Postgraduates (M.E./M.Tech/MBA/MD/etc.), PhD scholars, and corporate working professionals are strictly prohibited.',
      tag: 'Eligibility Rule',
    },
    {
      num: '02',
      title: 'Team Composition & Cross-Colleges',
      content:
        'Teams must consist of 4 to 6 members, including 1 designated Team Leader. Cross-college, cross-department, and multi-year teams are highly encouraged. Every member must possess a valid college photo ID card for physical check-in.',
      tag: 'Team Rules',
    },
    {
      num: '03',
      title: 'Round 1: Online PPT Idea Evaluation (₹50 Fee)',
      content:
        'Teams must select 1 of the 23 official competition tracks and upload their project presentation following the official AITHON PPT format (.pptx or .ppt, max 25MB). A nominal evaluation fee of ₹50 per team is required to lock your sequential Team ID.',
      tag: 'Round 1 Flow',
    },
    {
      num: '04',
      title: 'Round 2: 12-Hour On-Campus Grand Finale at AVCOE',
      content:
        'Shortlisted teams will receive official selection letters to compete at Amrutvahini College of Engineering (AVCOE), Sangamner, Maharashtra for a 12-hour continuous offline sprint. Grand Finale registration fee is ₹200 per member (includes food, high-speed WiFi, lab facilities, and mentor support).',
      tag: 'Grand Finale',
    },
    {
      num: '05',
      title: 'Technology, Generative AI & Hardware Guidelines',
      content:
        'Participants can freely utilize open-source frameworks, machine learning models, GenAI APIs, cloud services, microcontrollers (Arduino/ESP32/Raspberry Pi), and custom sensor hardware. Pre-built commercial turnkey solutions are strictly forbidden.',
      tag: 'Tech Policy',
    },
    {
      num: '06',
      title: '100% Student Intellectual Property Ownership',
      content:
        'All intellectual property, proprietary code, hardware designs, and algorithms developed during AITHON 2.0 remain 100% the property of the participating students and their team.',
      tag: 'IP Rights',
    },
    {
      num: '07',
      title: 'Originality, Anti-Plagiarism & Code of Conduct',
      content:
        'All submissions are subjected to automated similarity and originality audits. Any discovered plagiarism, falsification of credentials, or unethical behavior will lead to instantaneous disqualification without refund.',
      tag: 'Zero Tolerance',
    },
    {
      num: '08',
      title: 'Jury Evaluation & Final Verdict',
      content:
        'Submissions are assessed by an elite panel of industrial researchers and academic experts on: (1) Problem Significance, (2) AI/Tech Architectural Rigor, (3) Feasibility & Novelty, and (4) Prototype Execution. Jury decisions are final and binding.',
      tag: 'Evaluation',
    },
  ]

  return (
    <div className="space-y-8">
      {/* ==================================================
          PAGE HERO BANNER
          ================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#062b59] via-[#09356d] to-[#041a37] text-white p-6 sm:p-10 shadow-lg border border-blue-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-48 h-48 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[11px] font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Official Candidate Instructions & Guidelines</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight !text-white text-white uppercase leading-tight" style={{ color: '#ffffff' }}>
            <span className="!text-white text-white" style={{ color: '#ffffff' }}>Read Before Starting</span>{' '}
            <span className="text-orange-400">Step 1</span>{' '}
            <span className="!text-white text-white" style={{ color: '#ffffff' }}>Registration</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
            Welcome to <strong>AITHON 2.0</strong> — National Level AI Hackathon organized at{' '}
            <span className="text-white font-medium">Amrutvahini College of Engineering (AVCOE), Sangamner</span>.
            Review the <strong>PPT Presentation Format</strong>, explore the <strong>23 Competition Tracks</strong>,
            verify your <strong>Eligibility</strong>, and agree to the <strong>Official Rule Book</strong> before proceeding.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <Users className="w-4 h-4 text-orange-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Team Size</span>
                <span className="font-bold text-white">4 to 6 Members</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Eligibility</span>
                <span className="font-bold text-white">UG & Diploma Only</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Evaluation Fee</span>
                <span className="font-bold text-white">₹50 / Team (UPI)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Finale Venue</span>
                <span className="font-bold text-white">AVCOE Sangamner</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          SECTION 1: OFFICIAL PPT PRESENTATION FORMAT
          ================================================== */}
      <div id="ppt-format" className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#edebe6]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ea580c] flex items-center justify-center border border-orange-200 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c] bg-orange-50 px-2 py-0.5 rounded border border-orange-200 inline-block mb-1">
                Mandatory Format
              </span>
              <h2 className="text-lg sm:text-xl font-black text-[#062b59] uppercase tracking-tight">
                1. Official PPT Presentation Format
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Download the official template below. You will be required to upload your completed presentation in Step 4.
              </p>
            </div>
          </div>

          {/* Download Action */}
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <a
              href="/AITHON_2.0_Presentation.pptx"
              download="AITHON_2.0_Presentation.pptx"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer group"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>Download Official PPT (.pptx)</span>
            </a>
          </div>
        </div>

        {/* Slide-by-Slide Structure Details */}
        <div className="space-y-4">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ea580c]" />
            <span>Recommended Slide Structure (5–7 Slides Total)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#edebe6] space-y-1.5 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ea580c] bg-orange-100/60 px-2 py-0.5 rounded">
                  SLIDE 1
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Title & Team</span>
              </div>
              <h4 className="text-sm font-bold text-[#062b59]">Cover & Team Details</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Project Title, Team Name, Selected Track, Team Lead & Member Names with College Affiliation & Branch.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#edebe6] space-y-1.5 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ea580c] bg-orange-100/60 px-2 py-0.5 rounded">
                  SLIDE 2
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Problem Scope</span>
              </div>
              <h4 className="text-sm font-bold text-[#062b59]">Problem Statement</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear real-world problem background, existing shortcomings, target audience, and why this requires an intelligent solution.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#edebe6] space-y-1.5 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ea580c] bg-orange-100/60 px-2 py-0.5 rounded">
                  SLIDE 3
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Architecture</span>
              </div>
              <h4 className="text-sm font-bold text-[#062b59]">Proposed AI Solution</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Detailed architecture diagram, workflow pipeline, core ML/AI models, data flow, and user experience flow.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#edebe6] space-y-1.5 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ea580c] bg-orange-100/60 px-2 py-0.5 rounded">
                  SLIDE 4
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Tech & Hardware</span>
              </div>
              <h4 className="text-sm font-bold text-[#062b59]">Tech Stack & Hardware</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Programming languages, frameworks (PyTorch/React), APIs, databases, microcontrollers, and hardware sensors used.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#edebe6] space-y-1.5 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ea580c] bg-orange-100/60 px-2 py-0.5 rounded">
                  SLIDE 5
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Impact</span>
              </div>
              <h4 className="text-sm font-bold text-[#062b59]">Feasibility & Impact</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Social, economic, or environmental benefits, novelty compared to existing tools, and measurable impact metrics.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#edebe6] space-y-1.5 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ea580c] bg-orange-100/60 px-2 py-0.5 rounded">
                  SLIDE 6
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Demonstration</span>
              </div>
              <h4 className="text-sm font-bold text-[#062b59]">Finale Prototype Plan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                What functional prototype or proof-of-concept will your team build during the 12-hour offline Grand Finale.
              </p>
            </div>
          </div>

          {/* Submission Guidelines Note */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
            <FileCheck className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#062b59]">File Upload Requirements:</strong> Both <strong>.ppt / .pptx</strong> and <strong>.pdf</strong> formats are accepted. Maximum allowed file size is <strong>25MB</strong>. Please compress heavy media or high-res images before uploading in Step 4.
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          SECTION 2: COMPETITION TRACKS INFORMATION
          ================================================== */}
      <div id="tracks-info" className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#edebe6]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center border border-blue-200 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
                23 National Tracks
              </span>
              <h2 className="text-lg sm:text-xl font-black text-[#062b59] uppercase tracking-tight">
                2. Competition Domains & Tracks Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Choose your track carefully. You will select your domain and exact track during Step 3 of registration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 bg-[#faf9f6] px-3 py-1.5 rounded-lg border border-[#edebe6]">
              All 23 Competition Tracks
            </span>
          </div>
        </div>

        {/* Domain Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border border-blue-200/90 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-blue-600 text-white shrink-0 shadow-xs">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                Domain 1
              </span>
              <h3 className="text-sm font-black text-[#062b59] mt-1">Software Domain</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                Web apps, mobile solutions, machine learning algorithms, deep learning, NLP, computer vision, APIs, and cloud-native AI systems.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/70 to-orange-50/40 border border-amber-200/90 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-600 text-white shrink-0 shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                Domain 2
              </span>
              <h3 className="text-sm font-black text-[#062b59] mt-1">Hardware & Embedded Domain</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                IoT devices, smart robotics, edge AI microcontrollers (Arduino/ESP32/Jetson), telemetry sensors, circuits, and automation kits.
              </p>
            </div>
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {TRACK_OPTIONS.map((track) => {
            const trackNum = track.split(':')[0].replace('Track ', '')
            const trackTitle = track.split(':')[1] || track
            const category = getCategoryForTrack(track)
            return (
              <div
                key={track}
                className="p-3.5 rounded-xl bg-[#faf9f6] border border-[#edebe6] hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-start gap-3 group"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-[#edebe6] text-[#062b59] group-hover:bg-[#062b59] group-hover:text-white group-hover:border-[#062b59] font-black text-xs flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                  {trackNum}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    {category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#062b59] group-hover:text-[#2563eb] transition-colors leading-snug">
                    {trackTitle.trim()}
                  </h4>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ==================================================
          SECTION 3: ELIGIBILITY CRITERIA
          ================================================== */}
      <div id="eligibility" className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b border-[#edebe6]">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
              Academic Criteria
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#062b59] uppercase tracking-tight">
              3. Academic Eligibility Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Strictly restricted to active Undergraduate (UG) and Polytechnic / Technical Diploma students.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Eligible Categories Box */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/90 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                Eligible Streams (UG & Diploma Only)
              </span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              Students enrolled in any recognized institution across India in the following programs are fully eligible:
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 pl-5 list-disc marker:text-emerald-600 font-medium">
              <li><strong>Engineering & Technology</strong> (B.E. / B.Tech / Diploma)</li>
              <li><strong>Medical, Dental & Healthcare</strong> (MBBS / BDS / B.Sc Nursing / BPT)</li>
              <li><strong>Pharmacy & Life Sciences</strong> (B.Pharm / Pharm.D)</li>
              <li><strong>Legal Studies</strong> (LL.B / B.A. LL.B / B.B.A. LL.B)</li>
              <li><strong>Business, Management & Finance</strong> (BBA / B.Com / B.A. Econ)</li>
              <li><strong>Arts, Humanities, Social Sciences & Media</strong> (B.A. / B.M.M.)</li>
              <li><strong>Design, Animation & Fine Arts</strong> (B.Des / B.FA)</li>
              <li><strong>Agricultural Sciences & Forestry</strong> (B.Sc. Agriculture)</li>
              <li><strong>Polytechnic & Technical Diploma Streams</strong></li>
            </ul>

            <div className="pt-2 border-t border-emerald-200/80 text-[11px] text-emerald-900 font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inter-departmental & cross-college teams are permitted!</span>
            </div>
          </div>

          {/* Ineligible Candidates Box */}
          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/90 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-900">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  ✕ Strictly Ineligible (Not Permitted)
                </span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed font-medium">
                The following candidate categories cannot register or participate in AITHON 2.0:
              </p>
              <ul className="text-xs text-slate-700 space-y-2.5 pl-5 list-disc marker:text-rose-600 font-medium">
                <li>
                  <strong className="text-rose-950">Postgraduate / Master&apos;s Students:</strong><br />
                  <span className="text-slate-600 text-[11px]">M.E. / M.Tech / MBA / M.Sc / M.Pharm / LL.M / MD / MS / MDS</span>
                </li>
                <li>
                  <strong className="text-rose-950">Doctoral & Post-Doctoral Scholars:</strong><br />
                  <span className="text-slate-600 text-[11px]">Ph.D. / Research Scholars</span>
                </li>
                <li>
                  <strong className="text-rose-950">Working & Corporate Professionals:</strong><br />
                  <span className="text-slate-600 text-[11px]">Industry employees, freelancers, or corporate personnel</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-white border border-rose-200 text-[11px] text-rose-800 font-bold leading-relaxed">
              ⚠️ <strong>Physical Verification:</strong> Valid College Photo ID Card confirming active UG/Diploma status is strictly required at check-in for the Grand Finale at AVCOE Sangamner.
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          SECTION 4: OFFICIAL RULE BOOK
          ================================================== */}
      <div id="rulebook" className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#edebe6]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block mb-1">
                Official Competition Code
              </span>
              <h2 className="text-lg sm:text-xl font-black text-[#062b59] uppercase tracking-tight">
                4. Official Rule Book & Terms
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Every team member must comply with the rules, code of conduct, and evaluation stages below.
              </p>
            </div>
          </div>

          <a
            href="https://drive.google.com/file/d/1kLBCXC_ZQBwb6IPuXlvfn7u2SdvMm6c6/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#faf9f6] hover:bg-white text-slate-700 border border-[#edebe6] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Official Rulebook (Google Drive)</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* Rulebook Clauses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ruleBookItems.map((item) => (
            <div
              key={item.num}
              className="p-4 rounded-xl bg-[#faf9f6] border border-[#edebe6] space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ea580c] bg-orange-100/70 px-2 py-0.5 rounded">
                  CLAUSE {item.num}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-white px-2 py-0.5 rounded border border-[#edebe6]">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-[#062b59]">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================
          SECTION 5: AGREEMENT CHECKBOX & PROCEED ACTION
          ================================================== */}
      <div className="bg-gradient-to-br from-[#faf9f6] to-white border-2 border-orange-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#062b59] uppercase tracking-tight">
              Declaration & Code of Conduct Agreement
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Please confirm that you have read and understood the entire Rulebook, verified your team&apos;s eligibility, and agree to the competition guidelines before starting Step 1 (Team Lead Details).
            </p>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="p-4 rounded-xl bg-white border border-[#edebe6] hover:border-orange-300 transition-colors">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rulesAgreed}
              onChange={(e) => {
                setRulesAgreed(e.target.checked)
                if (e.target.checked) setValidationError('')
              }}
              className="mt-1 w-5 h-5 rounded border-slate-300 text-[#ea580c] focus:ring-[#ea580c] cursor-pointer"
            />
            <div className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
              <span>
                I confirm that I have thoroughly read the <strong>AITHON 2.0 Official Rule Book</strong>, reviewed the <strong>PPT Presentation Format</strong>, verified our <strong>UG / Diploma Academic Eligibility</strong>, and our team agrees to abide by all the competition guidelines, evaluation criteria, and ethics code.
              </span>
            </div>
          </label>
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#ea580c]" />
            <span>Step 1 will collect Team Lead & College Information</span>
          </div>

          <button
            type="button"
            onClick={handleProceedClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer group"
          >
            <span>I Agree & Proceed to Step 1</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ==================================================
          MODAL: CONFIRMATION PROMPT
          "ask that i read rulebook and agree with it"
          ================================================== */}
      {showConfirmModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-black">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-base font-black text-[#062b59] uppercase tracking-tight">
                  Rulebook & Eligibility Confirmation
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-[#062b59] space-y-1.5">
                <p className="font-bold text-xs uppercase tracking-wider text-[#2563eb]">
                  Please verify before starting:
                </p>
                <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc marker:text-[#2563eb]">
                  <li>All team members are active <strong>UG or Diploma</strong> students (No Postgraduates / Working professionals).</li>
                  <li>You have noted the <strong>PPT template format</strong> and selected one of the <strong>23 tracks</strong>.</li>
                  <li>You understand the <strong>₹50 Round 1 evaluation fee</strong> and <strong>12-hour offline finale</strong> at AVCOE Sangamner.</li>
                </ul>
              </div>

              <p className="font-medium text-slate-700">
                Have you read the complete <strong>AITHON 2.0 Official Rulebook</strong>, and do you and your team agree to all stated terms and code of conduct?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <a
                href="https://drive.google.com/file/d/1kLBCXC_ZQBwb6IPuXlvfn7u2SdvMm6c6/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowConfirmModal(false)}
                className="w-full sm:w-auto h-11 inline-flex items-center justify-center gap-2 px-5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#062b59] hover:border-slate-400 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-2xs cursor-pointer text-center shrink-0"
              >
                <BookOpen className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>View Rulebook (PDF)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </a>

              <button
                type="button"
                onClick={handleConfirmAgreement}
                className="w-full sm:w-auto h-11 inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-sm hover:shadow-md cursor-pointer shrink-0"
              >
                <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>Yes, I Read & Agree</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
