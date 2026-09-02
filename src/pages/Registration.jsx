import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RegistrationProgress from '../components/RegistrationProgress'
import RegistrationInfo from '../components/RegistrationInfo'
import FormInput from '../components/FormInput'
import { useAdmin } from '../context/AdminContext'
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  GithubIcon,
  LinkedinIcon,
  GlobeIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
} from '../components/Icons'

const STEPS = [
  { number: 1, title: 'Team Lead Details' },
  { number: 2, title: 'Team Details' },
  { number: 3, title: 'Additional Info' },
]

const YEAR_OPTIONS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)',
  'Postgraduate / Master\'s',
  'Other',
]

const EXPERIENCE_OPTIONS = [
  'First-time Hacker (Beginner)',
  '1–2 Hackathons Attended',
  '3–5 Hackathons Attended',
  'Seasoned Veteran (5+ Hackathons)',
]

const REFERRAL_OPTIONS = [
  'College / Faculty Announcement',
  'Discord / Developer Community',
  'LinkedIn / Social Media',
  'Friends / Classmates',
  'Hackathon Listing Portal (Devpost/Devfolio)',
  'Other',
]

const POPULAR_SKILLS = [
  'Python',
  'React / Next.js',
  'PyTorch / LLMs',
  'Node.js / Express',
  'TypeScript',
  'FastAPI',
  'UI/UX Design',
  'Tailwind CSS',
  'Docker / Cloud',
  'PostgreSQL / MongoDB',
  'Solidity / Web3',
  'LangChain / Agentic AI',
]

export default function Registration() {
  const { registerTeam } = useAdmin()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [registrationId, setRegistrationId] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Team Lead
    leadFullName: '',
    leadEmail: '',
    leadPhone: '',
    leadCollege: '',
    leadCourse: '',
    leadYear: '',
    leadCity: '',

    // Step 2: Team Details
    teamName: '',
    teamSize: '3', // default 3 members (Lead + 2 members)
    members: [
      { fullName: '', email: '', college: '' },
      { fullName: '', email: '', college: '' },
      { fullName: '', email: '', college: '' },
    ],

    // Step 3: Additional Info
    github: '',
    linkedin: '',
    portfolio: '',
    skills: [],
    customSkill: '',
    experience: '',
    referral: '',
    agreedToTerms: false,
  })

  // Validation Errors
  const [errors, setErrors] = useState({})

  // Handle standard input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Handle Team Size change
  const handleTeamSizeChange = (sizeStr) => {
    setFormData((prev) => ({
      ...prev,
      teamSize: sizeStr,
    }))
  }

  // Handle Member field change
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

  // Toggle predefined skill
  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skill)
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      }
    })
  }

  // Add custom skill tag
  const handleAddCustomSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault()
      const trimmed = formData.customSkill.trim()
      if (trimmed && !formData.skills.includes(trimmed)) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, trimmed],
          customSkill: '',
        }))
      }
    }
  }

  // Validation Functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone) => /^[0-9+()-\s]{10,15}$/.test(phone.trim())

  const validateStep1 = () => {
    const errs = {}
    if (!formData.leadFullName.trim()) errs.leadFullName = 'Full name is required'
    if (!formData.leadEmail.trim()) {
      errs.leadEmail = 'Email address is required'
    } else if (!validateEmail(formData.leadEmail)) {
      errs.leadEmail = 'Enter a valid email address'
    }
    if (!formData.leadPhone.trim()) {
      errs.leadPhone = 'Phone number is required'
    } else if (!validatePhone(formData.leadPhone)) {
      errs.leadPhone = 'Enter a valid phone number (10 digits)'
    }
    if (!formData.leadCollege.trim()) errs.leadCollege = 'College / University name is required'
    if (!formData.leadCourse.trim()) errs.leadCourse = 'Course or branch is required'
    if (!formData.leadYear) errs.leadYear = 'Select your year of study'
    if (!formData.leadCity.trim()) errs.leadCity = 'City is required'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep2 = () => {
    const errs = {}
    if (!formData.teamName.trim()) {
      errs.teamName = 'Team name is required'
    } else if (formData.teamName.trim().length < 3) {
      errs.teamName = 'Team name must be at least 3 characters'
    }

    const teamSizeNum = parseInt(formData.teamSize, 10) || 3
    const membersNeeded = teamSizeNum - 1

    for (let i = 0; i < membersNeeded; i++) {
      const member = formData.members[i] || {}
      if (!member.fullName?.trim()) {
        errs[`member_${i}_fullName`] = `Teammate ${i + 1} full name is required`
      }
      if (!member.email?.trim()) {
        errs[`member_${i}_email`] = `Teammate ${i + 1} email is required`
      } else if (!validateEmail(member.email)) {
        errs[`member_${i}_email`] = `Enter a valid email address for Teammate ${i + 1}`
      }
      if (!member.college?.trim()) {
        errs[`member_${i}_college`] = `Teammate ${i + 1} college name is required`
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep3 = () => {
    const errs = {}
    if (!formData.agreedToTerms) {
      errs.agreedToTerms = 'You must agree to the hackathon guidelines and code of conduct'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2)
        window.scrollTo({ top: 120, behavior: 'smooth' })
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3)
        window.scrollTo({ top: 120, behavior: 'smooth' })
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }

  // Final Form Submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateStep3()) return

    setIsSubmitting(true)

    setTimeout(() => {
      const randomCode = Math.floor(1000 + Math.random() * 9000)
      const generatedId = `AI25-${randomCode}`
      setRegistrationId(generatedId)

      // Sync to AdminContext
      if (registerTeam) {
        registerTeam({
          ...formData,
          registrationId: generatedId,
        })
      }

      setIsSubmitting(false)
      setIsSubmitted(true)
      window.scrollTo({ top: 100, behavior: 'smooth' })
    }, 600)
  }

  const handleReset = () => {
    setFormData({
      leadFullName: '',
      leadEmail: '',
      leadPhone: '',
      leadCollege: '',
      leadCourse: '',
      leadYear: '',
      leadCity: '',
      teamName: '',
      teamSize: '3',
      members: [
        { fullName: '', email: '', college: '' },
        { fullName: '', email: '', college: '' },
        { fullName: '', email: '', college: '' },
      ],
      github: '',
      linkedin: '',
      portfolio: '',
      skills: [],
      customSkill: '',
      experience: '',
      referral: '',
      agreedToTerms: false,
    })
    setErrors({})
    setIsSubmitted(false)
    setCurrentStep(1)
  }

  const teamSizeNum = parseInt(formData.teamSize, 10) || 3
  const additionalMembersCount = teamSizeNum - 1

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Main Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* PAGE HERO */}
        <section className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="text-xs font-bold text-[#2563eb] uppercase tracking-widest mb-3">
            NATIONAL LEVEL AI HACKATHON
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#062b59] tracking-tight mb-3">
            TEAM <span className="text-[#2563eb]">REGISTRATION</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Fill in the details below to register your team for AITHON 2.0 at Amrutvahini College of Engineering, Sangamner.
          </p>
        </section>

        {isSubmitted ? (
          /* ==================================================
             SUCCESS STATE SCREEN
             ================================================== */
          <section className="max-w-2xl mx-auto">
            <div className="rounded-xl bg-white border border-[#edebe6] p-8 sm:p-12 shadow-sm text-center">
              {/* Animated Checkmark Badge */}
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6 shadow-xs">
                <CheckIcon className="w-8 h-8 stroke-[3]" />
              </div>

              {/* Success Headings */}
              <span className="inline-block px-3 py-1 rounded bg-blue-50 text-[#2563eb] text-xs font-bold tracking-wider uppercase mb-2">
                APPLICATION RECEIVED
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062b59] tracking-tight mb-3">
                REGISTRATION SUCCESSFUL
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
                Your team registration has been submitted successfully for AITHON 2.0. Our committee will review your application.
              </p>

              {/* Registration ID & Summary Card */}
              <div className="p-6 rounded-lg bg-[#faf9f6] border border-[#edebe6] mb-8 text-left space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#edebe6] gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registration ID</span>
                  <span className="font-mono text-base font-extrabold text-[#062b59] bg-white px-3 py-1 rounded border border-[#edebe6] inline-block shadow-xs">
                    {registrationId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-bold uppercase">TEAM NAME</span>
                    <span className="text-[#062b59] font-bold text-sm">{formData.teamName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-bold uppercase">TEAM LEADER</span>
                    <span className="text-[#062b59] font-bold text-sm">{formData.leadFullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-bold uppercase">TEAM SIZE</span>
                    <span className="text-[#062b59] font-bold text-sm">{formData.teamSize} Members</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-bold uppercase">PRIMARY EMAIL</span>
                    <span className="text-[#062b59] font-bold text-sm truncate block">{formData.leadEmail}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs text-center"
                >
                  BACK TO HOME
                </Link>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#faf9f6] hover:bg-white text-[#062b59] border border-[#edebe6] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  REGISTER ANOTHER TEAM
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* ==================================================
             MULTI-STEP REGISTRATION CONTAINER & SIDEBAR LAYOUT
             ================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left / Main Column: Multi-Step Registration Form */}
            <div className="lg:col-span-8">
              <div className="rounded-xl bg-white border border-[#edebe6] p-6 sm:p-8 lg:p-10 shadow-xs">
                {/* 3-Step Progress Indicator */}
                <RegistrationProgress
                  currentStep={currentStep}
                  steps={STEPS}
                  onStepClick={(stepNum) => {
                    if (stepNum < currentStep) {
                      setCurrentStep(stepNum)
                    }
                  }}
                />

                <form onSubmit={handleSubmit} noValidate>
                  {/* ==================================================
                      STEP 1 — TEAM LEAD DETAILS
                      ================================================== */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Step Header */}
                      <div className="pb-4 border-b border-[#edebe6]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#2563eb] border border-blue-100 uppercase">
                            STEP 01
                          </span>
                          <h2 className="text-xl sm:text-2xl font-extrabold text-[#062b59] m-0">
                            Team Lead Details
                          </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                          Enter the details of the team leader (Member 1).
                        </p>
                      </div>

                      {/* 2-Column Responsive Form Layout */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        {/* Full Name */}
                        <div className="sm:col-span-2">
                          <FormInput
                            label="Full Name"
                            name="leadFullName"
                            value={formData.leadFullName}
                            onChange={handleChange}
                            placeholder="e.g. Aarav Sharma"
                            required
                            error={errors.leadFullName}
                            icon={UserIcon}
                          />
                        </div>

                        {/* Email Address */}
                        <div>
                          <FormInput
                            label="Email Address"
                            type="email"
                            name="leadEmail"
                            value={formData.leadEmail}
                            onChange={handleChange}
                            placeholder="e.g. aarav.sharma@example.com"
                            required
                            error={errors.leadEmail}
                            icon={MailIcon}
                          />
                        </div>

                        {/* Phone Number */}
                        <div>
                          <FormInput
                            label="Phone Number"
                            type="tel"
                            name="leadPhone"
                            value={formData.leadPhone}
                            onChange={handleChange}
                            placeholder="e.g. 9876543210"
                            required
                            error={errors.leadPhone}
                            icon={PhoneIcon}
                          />
                        </div>

                        {/* College / University */}
                        <div className="sm:col-span-2">
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
                        </div>

                        {/* Course / Branch */}
                        <div>
                          <FormInput
                            label="Course / Branch"
                            name="leadCourse"
                            value={formData.leadCourse}
                            onChange={handleChange}
                            placeholder="e.g. B.Tech Computer Science / AI & DS"
                            required
                            error={errors.leadCourse}
                            icon={BookOpenIcon}
                          />
                        </div>

                        {/* Year of Study */}
                        <div>
                          <FormInput
                            label="Year of Study"
                            type="select"
                            name="leadYear"
                            value={formData.leadYear}
                            onChange={handleChange}
                            options={YEAR_OPTIONS}
                            placeholder="Select year..."
                            required
                            error={errors.leadYear}
                            icon={CalendarIcon}
                          />
                        </div>

                        {/* City */}
                        <div className="sm:col-span-2">
                          <FormInput
                            label="City"
                            name="leadCity"
                            value={formData.leadCity}
                            onChange={handleChange}
                            placeholder="e.g. Pune / Mumbai / Sangamner"
                            required
                            error={errors.leadCity}
                            icon={MapPinIcon}
                          />
                        </div>
                      </div>

                      {/* Step 1 Actions */}
                      <div className="pt-6 border-t border-[#edebe6] flex items-center justify-end">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs cursor-pointer group"
                        >
                          <span>NEXT: TEAM DETAILS</span>
                          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ==================================================
                       STEP 2 — TEAM DETAILS
                      ================================================== */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Step Header */}
                      <div className="pb-4 border-b border-[#edebe6]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#2563eb] border border-blue-100 uppercase">
                            STEP 02
                          </span>
                          <h2 className="text-xl sm:text-2xl font-extrabold text-[#062b59] m-0">
                            Team Details
                          </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                          Specify your team name and add details of your teammates (Leader is Member 1).
                        </p>
                      </div>

                      {/* Team Name & Size Selectors */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <FormInput
                            label="Team Name"
                            name="teamName"
                            value={formData.teamName}
                            onChange={handleChange}
                            placeholder="e.g. Neural Nexus"
                            required
                            error={errors.teamName}
                            icon={UsersIcon}
                          />
                        </div>

                        {/* Team Size Selector (2, 3, 4) */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#062b59]">
                            Team Size <span className="text-[#ea580c] font-bold">*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-2.5">
                            {['2', '3', '4'].map((size) => {
                              const isSelected = formData.teamSize === size
                              return (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => handleTeamSizeChange(size)}
                                  className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#062b59] text-white border-2 border-[#062b59] shadow-xs'
                                      : 'bg-[#faf9f6] text-slate-700 border border-[#edebe6] hover:border-slate-300'
                                  }`}
                                >
                                  <span>{size} Members</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Team Members Cards */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold tracking-wider text-[#062b59] uppercase">
                            ADDITIONAL TEAM MEMBERS ({additionalMembersCount})
                          </h3>
                          <span className="text-xs text-slate-500">
                            Leader: <strong className="text-[#062b59]">{formData.leadFullName || 'You'}</strong>
                          </span>
                        </div>

                        {Array.from({ length: additionalMembersCount }).map((_, idx) => {
                          const memberNum = idx + 2
                          const memberData = formData.members[idx] || {}
                          return (
                            <div
                              key={idx}
                              className="p-4 sm:p-5 rounded-lg bg-[#faf9f6] border border-[#edebe6] space-y-4"
                            >
                              <div className="flex items-center justify-between pb-2 border-b border-[#edebe6]">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-[#062b59] text-[10px] font-bold text-white flex items-center justify-center">
                                    {memberNum}
                                  </div>
                                  <span className="text-xs font-bold text-[#062b59]">
                                    Team Member {idx + 1} (Member #{memberNum})
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-[#ea580c] uppercase">Required</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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
                                  placeholder="member@example.com"
                                  required
                                  error={errors[`member_${idx}_email`]}
                                  icon={MailIcon}
                                />
                                <FormInput
                                  label="College / University"
                                  value={memberData.college || ''}
                                  onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                                  placeholder="College name"
                                  required
                                  error={errors[`member_${idx}_college`]}
                                  icon={AcademicCapIcon}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Step 2 Actions */}
                      <div className="pt-6 border-t border-[#edebe6] flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#faf9f6] hover:bg-white text-slate-700 border border-[#edebe6] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer group shadow-xs"
                        >
                          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          <span>BACK</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer group"
                        >
                          <span>NEXT: ADDITIONAL INFO</span>
                          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ==================================================
                      STEP 3 — ADDITIONAL INFORMATION
                      ================================================== */}
                  {currentStep === 3 && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Step Header */}
                      <div className="pb-4 border-b border-[#edebe6]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#2563eb] border border-blue-100 uppercase">
                            STEP 03
                          </span>
                          <h2 className="text-xl sm:text-2xl font-extrabold text-[#062b59] m-0">
                            Additional Information
                          </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                          Provide links to your team's code profiles, technical skillsets, and experience.
                        </p>
                      </div>

                      {/* Social & Portfolio Links (2-Column) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <FormInput
                            label="GitHub Profile / Org"
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            placeholder="https://github.com/your-username"
                            icon={GithubIcon}
                          />
                        </div>

                        <div>
                          <FormInput
                            label="LinkedIn Profile"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/your-profile"
                            icon={LinkedinIcon}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <FormInput
                            label="Portfolio / Website (Optional)"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleChange}
                            placeholder="https://yourportfolio.dev"
                            icon={GlobeIcon}
                          />
                        </div>
                      </div>

                      {/* Technical Skills Selection */}
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#062b59] block">
                          Technical Skills & Stack
                        </label>

                        {/* Popular & Custom Skill Badges */}
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set([...POPULAR_SKILLS, ...formData.skills])).map((skill) => {
                            const isSelected = formData.skills.includes(skill)
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-50 text-[#2563eb] font-bold border-2 border-[#2563eb]'
                                    : 'bg-[#faf9f6] text-slate-600 border border-[#edebe6] hover:border-slate-300'
                                }`}
                              >
                                {isSelected ? <span>✓</span> : <span>+</span>}
                                <span>{skill}</span>
                              </button>
                            )
                          })}
                        </div>

                        {/* Custom Skill Input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            name="customSkill"
                            value={formData.customSkill}
                            onChange={handleChange}
                            onKeyDown={handleAddCustomSkill}
                            placeholder="Add other skill (e.g. Flutter, Rust, OpenCV)..."
                            className="flex-1 rounded-lg bg-[#faf9f6] focus:bg-white border border-[#edebe6] focus:border-[#2563eb] px-3.5 py-2 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomSkill}
                            className="px-4 py-2 rounded-lg bg-[#062b59] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                          >
                            + ADD
                          </button>
                        </div>
                      </div>

                      {/* Experience and Referral Selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <FormInput
                            label="Previous Hackathon Experience"
                            type="select"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            options={EXPERIENCE_OPTIONS}
                            placeholder="Select experience level..."
                          />
                        </div>

                        <div>
                          <FormInput
                            label="How did you hear about AITHON 2.0?"
                            type="select"
                            name="referral"
                            value={formData.referral}
                            onChange={handleChange}
                            options={REFERRAL_OPTIONS}
                            placeholder="Select referral source..."
                          />
                        </div>
                      </div>

                      {/* Required Terms & Conditions Checkbox */}
                      <div className="pt-2">
                        <div
                          className={`p-4 rounded-lg border transition-colors ${
                            errors.agreedToTerms
                              ? 'bg-rose-50 border-rose-300'
                              : 'bg-[#faf9f6] border border-[#edebe6] hover:border-slate-300'
                          }`}
                        >
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              name="agreedToTerms"
                              checked={formData.agreedToTerms}
                              onChange={handleChange}
                              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb] cursor-pointer"
                            />
                            <div className="text-xs text-slate-700 leading-relaxed">
                              <span className="font-bold text-[#062b59]">I agree to the hackathon guidelines and code of conduct.</span>{' '}
                              We confirm that all details provided are accurate and our team commits to adhering to the official rules of AITHON 2.0.
                            </div>
                          </label>
                        </div>
                        {errors.agreedToTerms && (
                          <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                            <span>⚠</span> {errors.agreedToTerms}
                          </p>
                        )}
                      </div>

                      {/* Step 3 Actions */}
                      <div className="pt-6 border-t border-[#edebe6] flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#faf9f6] hover:bg-white text-slate-700 border border-[#edebe6] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer group disabled:opacity-50 shadow-xs"
                        >
                          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          <span>BACK</span>
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer disabled:opacity-50 group"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                              </svg>
                              <span>SUBMITTING...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheckIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              <span>SUBMIT REGISTRATION</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Right Column: Registration Info Sidebar */}
            <div className="lg:col-span-4 w-full">
              <RegistrationInfo />
            </div>
          </div>
        )}
      </main>

      {/* Official Footer */}
      <Footer />
    </div>
  )
}
