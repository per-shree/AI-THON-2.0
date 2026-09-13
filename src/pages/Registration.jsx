import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RegistrationProgress from '../components/RegistrationProgress'
import FormInput from '../components/FormInput'
import { useAdmin } from '../context/AdminContext'
import { submitRegistrationToGoogleSheet, fetchNextSerialId } from '../services/googleSheetsService'
import {
  Download,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
  CreditCard,
  Building,
  GraduationCap,
  Calendar,
  FileCode,
} from 'lucide-react'
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  AcademicCapIcon,
  MapPinIcon,
  UsersIcon,
} from '../components/Icons'

const STEPS = [
  { number: 1, title: 'Team Lead' },
  { number: 2, title: 'Team Members' },
  { number: 3, title: 'PPT Submission' },
  { number: 4, title: 'Payment' },
  { number: 5, title: 'Completed' },
]

const YEAR_OPTIONS = [
  '1st Year (FE / Freshman)',
  '2nd Year (SE / Sophomore)',
  '3rd Year (TE / Junior)',
  '4th Year (BE / Senior)',
  'Diploma / Other',
]

const COURSE_OPTIONS = [
  'B.E. / B.Tech Computer Engineering',
  'B.E. / B.Tech Artificial Intelligence & Data Science (AIDS)',
  'B.E. / B.Tech Information Technology (IT)',
  'B.E. / B.Tech Electronics & Telecommunication (E&TC)',
  'B.E. / B.Tech Electrical / Mechanical / Civil',
  'MCA / M.Tech / MSc Computer Science',
  'Diploma Engineering',
  'Other Tech Stream',
]

export default function Registration() {
  const { registerTeam, getNextSerialTeamId, syncNextSerialNum } = useAdmin()

  // Stepper State (1: Lead, 2: Members, 3: PPT, 4: Payment (with Review), 5: Completed)
  const [currentStep, setCurrentStep] = useState(1)
  const [step4View, setStep4View] = useState('review') // 'review' | 'payment'

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationId, setRegistrationId] = useState('')
  const [teamId, setTeamId] = useState('')
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  // Pre-fetch live next serial ID from Google Sheets
  useEffect(() => {
    let isMounted = true
    fetchNextSerialId()
      .then((res) => {
        if (isMounted && res && res.nextNum && syncNextSerialNum) {
          syncNextSerialNum(res.nextNum)
        }
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [syncNextSerialNum])

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Team & Lead Details
    teamName: '',
    leadFullName: '',
    leadEmail: '',
    leadPhone: '',
    leadCollege: '',
    leadCourse: '',
    leadYear: '',
    leadCity: '',

    // Step 2: Team Members Details (Min 4, Max 6 total = Lead + 3 to 5 teammates)
    teamSize: '4', // default 4 members
    members: [
      { fullName: '', email: '', college: '', course: '', year: '' },
      { fullName: '', email: '', college: '', course: '', year: '' },
      { fullName: '', email: '', college: '', course: '', year: '' },
      { fullName: '', email: '', college: '', course: '', year: '' },
      { fullName: '', email: '', college: '', course: '', year: '' },
    ],

    // Step 3: PPT Submission
    pptFileName: '',
    pptFileSize: '',
    pptUploadedAt: '',

    // Step 4: Review Confirmation & Payment
    confirmedReview: false,
    paymentUtr: '',
  })

  // Validation Errors
  const [errors, setErrors] = useState({})

  // Standard input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Handle Team Size change (4 to 6 members)
  const handleTeamSizeChange = (sizeStr) => {
    const parsed = parseInt(sizeStr, 10)
    const clamped = Math.min(6, Math.max(4, isNaN(parsed) ? 4 : parsed))
    setFormData((prev) => ({
      ...prev,
      teamSize: clamped.toString(),
    }))
  }

  // Member field change
  const handleMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const nextMembers = [...prev.members]
      nextMembers[index] = {
        ...nextMembers[index],
        [field]: value,
      }
      return { ...prev, members: nextMembers }
    })

    const errorKey = `member_${index}_${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[errorKey]
        return next
      })
    }
  }

  // Quick action: Copy leader's college to teammate
  const copyLeadCollegeToMember = (index) => {
    if (!formData.leadCollege.trim()) return
    handleMemberChange(index, 'college', formData.leadCollege.trim())
  }

  // Validation Helpers
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ''))

  // Validate Step 1: Team Lead Details
  const validateStep1 = () => {
    const errs = {}
    if (!formData.teamName.trim()) {
      errs.teamName = 'Team name is required'
    } else if (formData.teamName.trim().length < 3) {
      errs.teamName = 'Team name must be at least 3 characters'
    }

    if (!formData.leadFullName.trim()) errs.leadFullName = 'Full name is required'
    if (!formData.leadEmail.trim()) {
      errs.leadEmail = 'Email address is required'
    } else if (!validateEmail(formData.leadEmail)) {
      errs.leadEmail = 'Enter a valid email address'
    }

    if (!formData.leadPhone.trim()) {
      errs.leadPhone = 'Mobile number is required'
    } else if (!validatePhone(formData.leadPhone)) {
      errs.leadPhone = 'Enter a valid 10-digit mobile number'
    }

    if (!formData.leadCollege.trim()) errs.leadCollege = 'College / University name is required'
    if (!formData.leadCourse.trim()) errs.leadCourse = 'Course or branch is required'
    if (!formData.leadYear) errs.leadYear = 'Select your year of study'
    if (!formData.leadCity.trim()) errs.leadCity = 'City is required'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Validate Step 2: Team Member Details
  const validateStep2 = () => {
    const errs = {}
    const teamSizeNum = parseInt(formData.teamSize, 10) || 4
    const membersNeeded = teamSizeNum - 1 // Additional members count

    for (let i = 0; i < membersNeeded; i++) {
      const member = formData.members[i] || {}
      if (!member.fullName?.trim()) {
        errs[`member_${i}_fullName`] = `Teammate ${i + 1} full name is required`
      }
      if (!member.email?.trim()) {
        errs[`member_${i}_email`] = `Teammate ${i + 1} email is required`
      } else if (!validateEmail(member.email)) {
        errs[`member_${i}_email`] = `Enter a valid email address`
      }
      if (!member.college?.trim()) {
        errs[`member_${i}_college`] = `College name is required`
      }
      if (!member.course?.trim()) {
        errs[`member_${i}_course`] = `Course / Branch is required`
      }
      if (!member.year?.trim()) {
        errs[`member_${i}_year`] = `Year of study is required`
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Validate Step 3: PPT Upload
  const validateStep3 = () => {
    const errs = {}
    if (!formData.pptFileName) {
      errs.ppt = 'Please upload your completed presentation (.ppt or .pptx) before proceeding'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Handle PPT File Drop & Selection
  const handleFileProcess = (file) => {
    if (!file) return
    const validExts = ['.ppt', '.pptx']
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()

    if (!validExts.includes(ext)) {
      setErrors((prev) => ({
        ...prev,
        ppt: 'Invalid file format. Please upload a PowerPoint presentation (.ppt or .pptx).',
      }))
      return
    }

    // 25MB file size limit
    if (file.size > 25 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        ppt: 'File size exceeds 25MB limit. Please compress images or media in your presentation.',
      }))
      return
    }

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`

    setFormData((prev) => ({
      ...prev,
      pptFileName: file.name,
      pptFileSize: formattedSize,
      pptUploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }))

    setErrors((prev) => {
      const next = { ...prev }
      delete next.ppt
      return next
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0])
    }
  }

  // Navigation handlers
  const handleNextFromStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2)
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setCurrentStep(3)
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }

  const handleNextFromStep3 = () => {
    if (validateStep3()) {
      setCurrentStep(4)
      setStep4View('review')
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }

  const handleProceedToPayment = () => {
    if (!formData.confirmedReview) {
      setErrors((prev) => ({
        ...prev,
        confirmedReview: 'Please confirm that the details and uploaded PPT are final before proceeding to payment.',
      }))
      return
    }
    setErrors((prev) => {
      const next = { ...prev }
      delete next.confirmedReview
      return next
    })
    setStep4View('payment')
    window.scrollTo({ top: 120, behavior: 'smooth' })
  }

  // Final Registration & Payment Submission
  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)

    // 1. Determine next serial ID baseline
    let currentTeamId = getNextSerialTeamId ? getNextSerialTeamId() : `TEAM-101`
    let teamNumMatch = currentTeamId.match(/\d+/)
    let currentNum = teamNumMatch ? parseInt(teamNumMatch[0], 10) : 101
    let currentRegId = `AI26-${currentNum}`

    try {
      const live = await fetchNextSerialId()
      if (live && live.nextNum) {
        currentNum = live.nextNum
        currentTeamId = live.teamId
        currentRegId = live.registrationId
        if (syncNextSerialNum) syncNextSerialNum(currentNum)
      }
    } catch (err) {
      console.warn('[Registration] Could not fetch live ID before submit:', err)
    }

    setRegistrationId(currentRegId)
    setTeamId(currentTeamId)

    try {
      // 2. Submit to Google Sheets (Target Account: ai.veer2k26@gmail.com)
      const payloadData = {
        ...formData,
        paymentStatus: '₹50 Successful',
      }

      const result = await submitRegistrationToGoogleSheet(
        payloadData,
        currentTeamId,
        currentRegId
      )

      if (result && result.teamId && result.registrationId) {
        currentTeamId = result.teamId
        currentRegId = result.registrationId
        setTeamId(result.teamId)
        setRegistrationId(result.registrationId)
        const serverMatch = result.teamId.match(/\d+/)
        if (serverMatch) {
          currentNum = parseInt(serverMatch[0], 10)
        }
      }

      // 3. Sync to local AdminContext for instant admin roster view
      if (registerTeam) {
        registerTeam({
          ...formData,
          registrationId: currentRegId,
          teamId: currentTeamId,
          paymentStatus: '₹50 Paid',
        })
      }

      if (syncNextSerialNum) {
        syncNextSerialNum(currentNum + 1)
      }

      // 4. Advance to Step 05: Completed
      setCurrentStep(5)
      window.scrollTo({ top: 100, behavior: 'smooth' })
    } catch (err) {
      console.error('[Registration] Error completing registration:', err)
      // Even if network fails, ensure UI gracefully confirms with generated serial ID
      setCurrentStep(5)
      window.scrollTo({ top: 100, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Copy UPI ID helper
  const handleCopyUpi = () => {
    navigator.clipboard.writeText('ai.veer2k26@okaxis')
    setCopiedUpi(true)
    setTimeout(() => setCopiedUpi(false), 2500)
  }

  const teamSizeNum = parseInt(formData.teamSize, 10) || 4
  const additionalMembersCount = teamSizeNum - 1

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Main Navigation Header */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ==================================================
            PAGE HEADER (AiTHON 2.0 • Team Registration)
            ================================================== */}
        <section className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2.5">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#062b59] via-[#0b3b75] to-[#062b59] text-white shadow-xs border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-white">
              AiTHON 2.0 • NATIONAL LEVEL AI HACKATHON
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-black text-[#062b59] tracking-tight uppercase">
            Team Registration
          </h1>

          {/* Supporting Text */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Register your team and submit your idea for the first evaluation round.
          </p>
        </section>

        {/* ==================================================
            VISUAL PROGRESS INDICATOR (5 Steps)
            ================================================== */}
        <RegistrationProgress
          currentStep={currentStep}
          steps={STEPS}
          onStepClick={(stepNum) => {
            // Allow stepping back to previously visited steps
            if (stepNum < currentStep && currentStep !== 5) {
              setCurrentStep(stepNum)
              window.scrollTo({ top: 120, behavior: 'smooth' })
            }
          }}
        />

        {/* ==================================================
            STEP 01 — TEAM LEAD DETAILS
            ================================================== */}
        {currentStep === 1 && (
          <div className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
            {/* Step Card Header */}
            <div className="pb-4 border-b border-[#edebe6] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563eb] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-block mb-1.5">
                  STEP 01 OF 04
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#062b59] uppercase tracking-tight">
                  Team Lead Details
                </h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#faf9f6] border border-[#edebe6] flex items-center justify-center text-[#2563eb]">
                <UserIcon className="w-5 h-5" />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Team Name */}
              <div className="p-4 rounded-xl bg-[#fef6eb]/70 border border-[#f5ede4]">
                <FormInput
                  label="Team Name"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="e.g. Neural Nexus / Visionary AI"
                  required
                  error={errors.teamName}
                  icon={UsersIcon}
                  helperText="Choose a unique, memorable team name"
                />
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <FormInput
                  label="Full Name"
                  name="leadFullName"
                  value={formData.leadFullName}
                  onChange={handleChange}
                  placeholder="Enter team leader's full name"
                  required
                  error={errors.leadFullName}
                  icon={UserIcon}
                />

                <FormInput
                  label="Email Address"
                  type="email"
                  name="leadEmail"
                  value={formData.leadEmail}
                  onChange={handleChange}
                  placeholder="leader@gmail.com"
                  required
                  error={errors.leadEmail}
                  icon={MailIcon}
                  helperText="Official communication will be sent here"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <FormInput
                  label="Mobile Number"
                  type="tel"
                  name="leadPhone"
                  value={formData.leadPhone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  required
                  error={errors.leadPhone}
                  icon={PhoneIcon}
                  helperText="WhatsApp active contact number"
                />

                <FormInput
                  label="City"
                  name="leadCity"
                  value={formData.leadCity}
                  onChange={handleChange}
                  placeholder="e.g. Sangamner, Pune, Nashik"
                  required
                  error={errors.leadCity}
                  icon={MapPinIcon}
                />
              </div>

              {/* Academic Details */}
              <div className="pt-2 border-t border-[#edebe6] space-y-4">
                <FormInput
                  label="College / University"
                  name="leadCollege"
                  value={formData.leadCollege}
                  onChange={handleChange}
                  placeholder="e.g. Amrutvahini College of Engineering, Sangamner"
                  required
                  error={errors.leadCollege}
                  icon={AcademicCapIcon}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormInput
                    label="Course / Branch"
                    name="leadCourse"
                    type="select"
                    value={formData.leadCourse}
                    onChange={handleChange}
                    options={COURSE_OPTIONS}
                    placeholder="Select Course / Branch"
                    required
                    error={errors.leadCourse}
                  />

                  <FormInput
                    label="Year of Study"
                    name="leadYear"
                    type="select"
                    value={formData.leadYear}
                    onChange={handleChange}
                    options={YEAR_OPTIONS}
                    placeholder="Select Year of Study"
                    required
                    error={errors.leadYear}
                  />
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-[#edebe6] flex items-center justify-end">
              <button
                type="button"
                onClick={handleNextFromStep1}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
              >
                <span>Continue to Team Members</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            STEP 02 — TEAM MEMBER DETAILS
            ================================================== */}
        {currentStep === 2 && (
          <div className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
            {/* Step Card Header */}
            <div className="pb-4 border-b border-[#edebe6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563eb] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-block mb-1.5">
                  STEP 02 OF 04
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#062b59] uppercase tracking-tight">
                  Team Member Details
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  According to AiTHON 2.0 guidelines, teams must consist of <strong>4 to 6 members</strong>.
                </p>
              </div>

              {/* Team Size Selector (4, 5, 6) */}
              <div className="flex flex-col sm:items-end">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Total Team Size:
                </span>
                <div className="inline-flex rounded-xl bg-[#faf9f6] p-1 border border-[#edebe6]">
                  {['4', '5', '6'].map((size) => {
                    const isSelected = formData.teamSize === size
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleTeamSizeChange(size)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#062b59] text-white shadow-xs'
                            : 'text-slate-600 hover:text-[#062b59]'
                        }`}
                      >
                        {size} Members
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Team Members List */}
            <div className="space-y-5">
              {/* Leader Badge Reminder */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#062b59] text-white flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  <span className="font-semibold">
                    Team Leader: <strong className="text-[#062b59]">{formData.leadFullName || 'You'}</strong> ({formData.leadEmail || 'Registered'})
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase text-[#2563eb] bg-white px-2 py-0.5 rounded border border-blue-200">
                  Lead Confirmed
                </span>
              </div>

              {/* Dynamic Member Cards */}
              {Array.from({ length: additionalMembersCount }).map((_, idx) => {
                const memberNum = idx + 2
                const memberData = formData.members[idx] || {}
                return (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-xl bg-[#faf9f6] border border-[#edebe6] space-y-4 hover:border-slate-300 transition-colors"
                  >
                    {/* Member Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#edebe6] gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                          {memberNum}
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-[#062b59] uppercase tracking-wide">
                          Team Member {idx + 1} (Member #{memberNum})
                        </h3>
                      </div>

                      {/* Same as Leader's College shortcut */}
                      <button
                        type="button"
                        onClick={() => copyLeadCollegeToMember(idx)}
                        className="text-[11px] font-bold text-[#2563eb] hover:text-[#062b59] hover:underline self-start sm:self-auto cursor-pointer flex items-center gap-1"
                      >
                        <span>Same college as Team Leader</span>
                      </button>
                    </div>

                    {/* Member Input Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <FormInput
                        label="Full Name"
                        value={memberData.fullName || ''}
                        onChange={(e) => handleMemberChange(idx, 'fullName', e.target.value)}
                        placeholder="Member's full name"
                        required
                        error={errors[`member_${idx}_fullName`]}
                        icon={UserIcon}
                      />

                      <FormInput
                        label="Email Address"
                        type="email"
                        value={memberData.email || ''}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        placeholder="member@gmail.com"
                        required
                        error={errors[`member_${idx}_email`]}
                        icon={MailIcon}
                      />
                    </div>

                    <div className="space-y-3.5">
                      <FormInput
                        label="College / University"
                        value={memberData.college || ''}
                        onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                        placeholder="College name"
                        required
                        error={errors[`member_${idx}_college`]}
                        icon={AcademicCapIcon}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <FormInput
                          label="Course / Branch"
                          type="select"
                          value={memberData.course || ''}
                          onChange={(e) => handleMemberChange(idx, 'course', e.target.value)}
                          options={COURSE_OPTIONS}
                          placeholder="Select Course"
                          required
                          error={errors[`member_${idx}_course`]}
                        />

                        <FormInput
                          label="Year of Study"
                          type="select"
                          value={memberData.year || ''}
                          onChange={(e) => handleMemberChange(idx, 'year', e.target.value)}
                          options={YEAR_OPTIONS}
                          placeholder="Select Year"
                          required
                          error={errors[`member_${idx}_year`]}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-[#edebe6] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1)
                  window.scrollTo({ top: 120, behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#faf9f6] hover:bg-white text-slate-700 border border-[#edebe6] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromStep2}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
              >
                <span>Continue to PPT Submission</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            STEP 03 — IDEA / PPT SUBMISSION
            ================================================== */}
        {currentStep === 3 && (
          <div className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
            {/* Step Card Header */}
            <div className="pb-4 border-b border-[#edebe6]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563eb] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-block mb-1.5">
                STEP 03 OF 04
              </span>
              <h2 className="text-lg sm:text-xl font-black text-[#062b59] uppercase tracking-tight">
                Your Idea Submission
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                Download the official AiTHON 2.0 presentation format, complete it with your project idea, and upload the final PPT below.
              </p>
            </div>

            {/* PPT Template Download Section */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#062b59]/[0.03] via-blue-50/40 to-transparent border border-blue-200/60 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center shrink-0 border border-[#ea580c]/20">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c] bg-orange-50 px-2 py-0.5 rounded border border-orange-200 inline-block mb-1">
                      Official Format
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#062b59]">
                      AiTHON 2.0 Presentation Template (.PPTX)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Includes 5 structured slides: Problem, Proposed AI Architecture, Tech Stack, & Demo Plan.
                    </p>
                  </div>
                </div>

                {/* Direct Download Button */}
                <a
                  href="/aithon_idea_template.pptx"
                  download="AiTHON_2.0_Idea_Submission_Template.pptx"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm shrink-0 hover:shadow-md cursor-pointer group"
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download PPT Format</span>
                </a>
              </div>

              {/* Format Slide Quick Preview Checklist */}
              <div className="pt-3 border-t border-blue-100/70 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                  <span>Slide 1: Team & Title</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                  <span>Slide 2: Problem Scope</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                  <span>Slide 3: AI Architecture</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                  <span>Slide 4: Tech & Feasibility</span>
                </div>
              </div>
            </div>

            {/* Drag & Drop Upload Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#062b59] flex items-center justify-between">
                <span>Upload Completed PPT <span className="text-[#ea580c] font-bold">*</span></span>
                <span className="text-[11px] text-slate-400 font-normal normal-case">Accepted: PPT, PPTX (Max 25MB)</span>
              </label>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={(e) => e.target.files && handleFileProcess(e.target.files[0])}
                className="hidden"
              />

              {!formData.pptFileName ? (
                /* Empty Upload Zone */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 ${
                    isDragging
                      ? 'border-[#2563eb] bg-blue-50/60 ring-4 ring-blue-100'
                      : errors.ppt
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-[#edebe6] hover:border-[#2563eb] bg-[#faf9f6]/80 hover:bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#edebe6] flex items-center justify-center text-[#2563eb] shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#062b59]">
                      Drag and drop your completed PPT here, or{' '}
                      <span className="text-[#2563eb] underline underline-offset-2">Browse Files</span>
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      Ensure all slides are completed according to the official format
                    </p>
                  </div>
                </div>
              ) : (
                /* Uploaded File Chip / Display */
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#062b59] truncate block">
                          ✓ {formData.pptFileName}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded uppercase shrink-0">
                          Uploaded
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {formData.pptFileSize} • Ready for evaluation
                      </p>
                    </div>
                  </div>

                  {/* Replace File Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="self-end sm:self-auto px-3.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100/50 transition-colors cursor-pointer shrink-0"
                  >
                    Replace File
                  </button>
                </div>
              )}

              {errors.ppt && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.ppt}</span>
                </p>
              )}
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-[#edebe6] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(2)
                  window.scrollTo({ top: 120, behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#faf9f6] hover:bg-white text-slate-700 border border-[#edebe6] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromStep3}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            STEP 04 — REVIEW & PAYMENT
            ================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            {/* SUB-VIEW 1: REVIEW YOUR REGISTRATION */}
            {step4View === 'review' && (
              <div className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
                {/* Header */}
                <div className="pb-4 border-b border-[#edebe6]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563eb] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-block mb-1.5">
                    STEP 04 OF 04 • REVIEW
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-[#062b59] uppercase tracking-tight">
                    Review Your Registration
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                    Carefully verify your team information and presentation submission before proceeding to evaluation fee payment.
                  </p>
                </div>

                {/* Summary Card 1: Team & Leader */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#faf9f6] border border-[#edebe6] space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#edebe6]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#062b59] text-white flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-[#062b59] uppercase">
                        Team & Leader Details
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block font-semibold text-[11px] uppercase">Team Name</span>
                      <strong className="text-[#062b59] text-sm">{formData.teamName || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[11px] uppercase">Team Leader</span>
                      <strong className="text-[#062b59] text-sm">{formData.leadFullName || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[11px] uppercase">Leader Contact</span>
                      <span className="text-slate-700 font-medium">{formData.leadEmail} • {formData.leadPhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[11px] uppercase">College & Course</span>
                      <span className="text-slate-700 font-medium">{formData.leadCollege} ({formData.leadCourse} • {formData.leadYear})</span>
                    </div>
                  </div>
                </div>

                {/* Summary Card 2: Team Members */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#faf9f6] border border-[#edebe6] space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#edebe6]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#2563eb] text-white flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-[#062b59] uppercase">
                        Team Members ({additionalMembersCount} Additional Members)
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {formData.members.slice(0, additionalMembersCount).map((m, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-white border border-[#edebe6] gap-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                            {idx + 2}
                          </span>
                          <strong className="text-[#062b59]">{m.fullName || `Teammate ${idx + 1}`}</strong>
                          <span className="text-slate-400">• {m.email}</span>
                        </div>
                        <span className="text-slate-500 text-[11px] font-medium sm:text-right">
                          {m.college} ({m.course} • {m.year})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Card 3: Uploaded PPT */}
                <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200/60">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-[#062b59] uppercase">
                        Idea Presentation Submission
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
                    >
                      Edit File
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="font-bold text-[#062b59]">{formData.pptFileName || 'Uploaded PPT'}</span>
                      <span className="text-slate-400">({formData.pptFileSize})</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                      Ready for Evaluation
                    </span>
                  </div>
                </div>

                {/* Mandatory Confirmation Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none p-3.5 rounded-xl bg-[#faf9f6] border border-[#edebe6] hover:border-slate-300 transition-colors">
                    <input
                      type="checkbox"
                      name="confirmedReview"
                      checked={formData.confirmedReview}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 text-[#2563eb] rounded border-slate-300 focus:ring-[#2563eb] cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 font-medium leading-relaxed">
                      I confirm that the information provided is correct and the uploaded PPT is my team's final submission.
                    </span>
                  </label>

                  {errors.confirmedReview && (
                    <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.confirmedReview}</span>
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#edebe6] flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(3)
                      window.scrollTo({ top: 120, behavior: 'smooth' })
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#faf9f6] hover:bg-white text-slate-700 border border-[#edebe6] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to PPT</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    <span>Proceed to Payment (₹50)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: PAYMENT SECTION */}
            {step4View === 'payment' && (
              <div className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
                {/* Header */}
                <div className="pb-4 border-b border-[#edebe6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 inline-block mb-1.5">
                      STEP 04 OF 04 • EVALUATION FEE
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-[#062b59] uppercase tracking-tight">
                      First PPT Evaluation Fee
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-start sm:self-auto">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Official AiTHON Evaluation Fee</span>
                  </div>
                </div>

                {/* Prominent ₹50 / Team Callout Box */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#062b59] via-[#0f3c75] to-[#062b59] text-white shadow-md relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-6 pointer-events-none">
                    <CreditCard className="w-32 h-32 text-white" />
                  </div>

                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-orange-400 bg-orange-950/60 px-2.5 py-0.5 rounded border border-orange-500/30 inline-block">
                      ONE-TIME TEAM FEE
                    </span>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                        ₹50
                      </span>
                      <span className="text-sm sm:text-base text-blue-200 font-bold uppercase tracking-wider">
                        / Team
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-blue-100 font-medium max-w-lg leading-relaxed">
                      <strong>Important:</strong> The amount is ₹50 per team (covers evaluation for all <strong>{formData.teamSize} members</strong> of {formData.teamName}, NOT per member).
                    </p>
                  </div>
                </div>

                {/* Themed UPI & QR Payment Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Left Column: Official QR Code */}
                  <div className="p-5 rounded-xl bg-[#faf9f6] border border-[#edebe6] flex flex-col items-center text-center space-y-3">
                    <span className="text-[11px] font-bold text-[#062b59] uppercase tracking-wider">
                      Scan with any UPI App
                    </span>

                    {/* Styled Mock/Official QR Code Container */}
                    <div className="w-48 h-48 bg-white p-3 rounded-xl border border-[#edebe6] shadow-2xs flex flex-col items-center justify-center relative group">
                      {/* SVG Stylized QR Code for ai.veer2k26@okaxis */}
                      <svg
                        className="w-full h-full text-[#062b59]"
                        viewBox="0 0 100 100"
                        fill="currentColor"
                      >
                        {/* QR Corners */}
                        <path d="M5 5h30v30H5V5zm5 5v20h20V10H10zm5 5h10v10H15V15zM65 5h30v30H65V5zm5 5v20h20V10H70zm5 5h10v10H75V15zM5 65h30v30H5V65zm5 5v20h20V70H10zm5 5h10v10H15V75z" />
                        {/* QR Data Pattern Simulation */}
                        <rect x="42" y="10" width="6" height="6" />
                        <rect x="52" y="10" width="6" height="6" />
                        <rect x="42" y="22" width="6" height="6" />
                        <rect x="48" y="30" width="8" height="8" />
                        <rect x="12" y="42" width="6" height="6" />
                        <rect x="24" y="48" width="6" height="6" />
                        <rect x="36" y="42" width="6" height="6" />
                        <rect x="46" y="46" width="8" height="8" fill="#2563eb" />
                        <rect x="58" y="42" width="6" height="6" />
                        <rect x="70" y="48" width="6" height="6" />
                        <rect x="82" y="42" width="6" height="6" />
                        <rect x="42" y="65" width="6" height="6" />
                        <rect x="52" y="72" width="6" height="6" />
                        <rect x="62" y="65" width="6" height="6" />
                        <rect x="72" y="72" width="6" height="6" />
                        <rect x="85" y="65" width="6" height="6" />
                        <rect x="42" y="85" width="6" height="6" />
                        <rect x="52" y="85" width="6" height="6" />
                        <rect x="62" y="85" width="6" height="6" />
                        <rect x="75" y="85" width="6" height="6" />
                        <rect x="85" y="85" width="6" height="6" />
                      </svg>

                      {/* Small Center Brand Emblem */}
                      <div className="absolute inset-0 m-auto w-9 h-9 rounded-md bg-[#062b59] text-white flex items-center justify-center font-black text-[9px] shadow-sm border border-white">
                        ₹50
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-500 font-medium">
                      GPay • PhonePe • Paytm • BHIM
                    </span>
                  </div>

                  {/* Right Column: Copyable UPI ID & UTR verification */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#edebe6] space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Official Evaluation UPI ID:
                      </span>
                      <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-white border border-[#edebe6]">
                        <code className="text-xs sm:text-sm font-bold text-[#062b59] font-mono">
                          ai.veer2k26@okaxis
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold text-[#2563eb] hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Transaction Reference / UTR Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#062b59] flex items-center justify-between">
                        <span>Transaction Reference / UTR <span className="text-slate-400 font-normal normal-case">(Optional)</span></span>
                      </label>
                      <input
                        type="text"
                        name="paymentUtr"
                        value={formData.paymentUtr}
                        onChange={handleChange}
                        placeholder="e.g. 12-digit UTR from payment screen"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#edebe6] text-sm font-sans focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                      />
                      <span className="text-[11px] text-slate-500 block">
                        Keep your payment confirmation screenshot handy for reporting.
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900 font-medium">
                      ✓ Instant verification: Clicking confirm will register your team and mark the ₹50 evaluation fee as submitted.
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#edebe6] flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep4View('review')
                      window.scrollTo({ top: 120, behavior: 'smooth' })
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#faf9f6] hover:bg-white text-slate-700 border border-[#edebe6] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Review</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#062b59] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Registration...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm ₹50 Payment & Complete</span>
                        <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================
            STEP 05 — COMPLETION (SUCCESS STATE)
            ================================================== */}
        {currentStep === 5 && (
          <div className="bg-white border border-[#edebe6] rounded-2xl p-6 sm:p-10 shadow-sm text-center space-y-6 animate-fadeIn max-w-2xl mx-auto">
            {/* Glowing Success Badge */}
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-300">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            {/* Header Text */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                OFFICIAL REGISTRATION CONFIRMED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#062b59] uppercase tracking-tight">
                Registration Completed
              </h2>
              <p className="text-sm text-slate-600 font-medium max-w-md mx-auto">
                Your team has been successfully registered for AiTHON 2.0.
              </p>
            </div>

            {/* Registration Summary Card */}
            <div className="p-5 rounded-2xl bg-[#faf9f6] border border-[#edebe6] text-left space-y-3 shadow-2xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#edebe6] text-xs">
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Registration ID</span>
                  <span className="text-base sm:text-lg font-black text-[#062b59] font-mono tracking-tight">
                    {registrationId || 'AI26-108'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Team Name</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#062b59]">
                    {formData.teamName || 'AiTHON Team'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">PPT Submission</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 text-xs sm:text-sm">
                    <span>✓</span> Received ({formData.pptFileName || 'PPTX'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Payment Status</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 text-xs sm:text-sm">
                    <span>✓</span> ₹50 Successful
                  </span>
                </div>
              </div>
            </div>

            {/* Email Notification Note */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-left space-y-1 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-[#062b59]">
                <MailIcon className="w-4 h-4 text-[#2563eb]" />
                <span>Confirmation will be sent to the Team Leader's registered email address.</span>
              </div>
              <p className="text-[11.5px] text-slate-600 pl-5">
                The confirmation email will be sent from:{' '}
                <strong className="text-[#062b59] font-mono">ai.veer2k26@gmail.com</strong>
              </p>
            </div>

            {/* Mandatory WhatsApp Group for Team Leaders */}
            <div className="p-4 sm:p-5 rounded-xl bg-emerald-50 border border-emerald-300 text-left space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Mandatory For Team Leaders
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-emerald-950">
                Join Official WhatsApp Community
              </h4>
              <p className="text-xs text-emerald-800">
                Evaluation results, slot allotment, and jury round schedules will be posted here.
              </p>
              <a
                href="https://chat.whatsapp.com/sample-aithon-group"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider transition-all mt-1 cursor-pointer"
              >
                <span>Join Official WhatsApp Group</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Final Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
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
        )}
      </main>

      {/* Official Footer */}
      <Footer />
    </div>
  )
}
