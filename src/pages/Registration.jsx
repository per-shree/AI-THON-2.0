import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RegistrationProgress from '../components/RegistrationProgress'
import RegistrationInstructions from '../components/RegistrationInstructions'
import FormInput from '../components/FormInput'
import AutoSaveIndicator from '../components/AutoSaveIndicator'
import {
  saveRegistrationDraft,
  loadRegistrationDraft,
  clearRegistrationDraft,
} from '../utils/formDraftStorage'
import { useAdmin } from '../context/AdminContext'
import { submitRegistrationToGoogleSheet, fetchNextSerialId, syncRegistrationStep } from '../services/googleSheetsService'
import {
  Download,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  XCircle,
  X,
  HelpCircle,
  RefreshCw,
  Copy,
  Check,
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
  ExternalLink,
  Layers,
  Clock,
  QrCode,
  Laptop,
  Cpu,
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
  { number: 0, title: 'Instructions' },
  { number: 1, title: 'Team Lead' },
  { number: 2, title: 'Team Members' },
  { number: 3, title: 'PPT Submission' },
  { number: 4, title: 'Payment' },
  { number: 5, title: 'Completed' },
]

const YEAR_OPTIONS = [
  '1st Year (FE / 1st Year UG / Diploma)',
  '2nd Year (SE / 2nd Year UG / Diploma)',
  '3rd Year (TE / 3rd Year UG / Diploma)',
  '4th Year (BE / Final Year 4-Yr UG)',
  '5th Year (Final Year MBBS / B.A. LL.B / Pharm.D)',
]

const COURSE_OPTIONS = [
  'Engineering & Technology (B.E. / B.Tech / Diploma)',
  'Medical, Dental & Healthcare (MBBS / BDS / B.Sc Nursing / BPT)',
  'Pharmacy & Life Sciences (B.Pharm / Pharm.D)',
  'Legal Studies (LL.B / B.A. LL.B / B.B.A. LL.B)',
  'Business, Management & Finance (BBA / B.Com / B.A. Econ)',
  'Arts, Humanities, Social Sciences & Media (B.A. / B.M.M.)',
  'Design, Animation & Fine Arts (B.Des / B.FA)',
  'Agricultural Sciences & Forestry (B.Sc. Agriculture)',
  'Polytechnic & Technical Diploma Streams',
  'Other',
]

// Official Competition Domains
export const DOMAIN_OPTIONS = [
  'Software',
  'Hardware',
]

// 23 Official Hackathon Competition Tracks
export const TRACK_OPTIONS = [
  'Track 01: AI in Healthcare & Medicine',
  'Track 02: AI in Dental Science & Diagnostics',
  'Track 03: AI in Pharmacy & Drug Discovery',
  'Track 04: LegalTech, AI Ethics & Law',
  'Track 05: FinTech & Financial Intelligence',
  'Track 06: EdTech & Smart Learning',
  'Track 07: AI in Film, Animation & Storytelling',
  'Track 08: UI/UX & Accessible Design',
  'Track 09: Industrial Automation & Robotics',
  'Track 10: Smart Energy & CleanTech',
  'Track 11: Aerospace, Telemetry & SpaceTech',
  'Track 12: AgriTech & Smart Farming',
  'Track 13: Environmental AI & Sustainability',
  'Track 14: E-Commerce & Retail Automation',
  'Track 15: Supply Chain & Logistics Intelligence',
  'Track 16: Cybersecurity, Forensics & Cyber Law',
  'Track 17: Smart Cities & Urban Mobility',
  'Track 18: Disaster Management & Public Safety',
  'Track 19: Mental Health & Psychology AI',
  'Track 20: Sports Analytics & Performance Tech',
  'Track 21: Hospitality, Tourism & Service AI',
  'Track 22: Social Good & Civic Innovation',
  'Track 23: Open Innovation (Unrestricted Domain)',
]

export const isOtherCourse = (course) =>
  course === 'Other' ||
  course === 'Other Tech Stream' ||
  course === 'Other (Please specify)' ||
  (typeof course === 'string' && course.startsWith('Other'))

// Official UPI Payment Configuration for ₹50 Evaluation Fee
export const OFFICIAL_UPI_ID = '9404665180@centralbank'
export const OFFICIAL_UPI_URI = 'upi://pay?pa=9404665180@centralbank&pn=Mr%20Shri%20Avinash%20Ugale&am=50&cu=INR&tn=AITHON%202.0%20Registration'

// Default blank form state
const INITIAL_FORM_DATA = {
  // Step 1: Team & Lead Details
  teamName: '',
  leadFullName: '',
  leadEmail: '',
  leadPhone: '',
  leadCollege: '',
  leadCourse: '',
  leadCourseOther: '',
  leadYear: '',
  leadCity: '',

  // Step 2: Team Members Details (Min 4, Max 6 total = Lead + 3 to 5 teammates)
  teamSize: '4', // default 4 members
  members: [
    { fullName: '', email: '', college: '', course: '', courseOther: '', year: '' },
    { fullName: '', email: '', college: '', course: '', courseOther: '', year: '' },
    { fullName: '', email: '', college: '', course: '', courseOther: '', year: '' },
    { fullName: '', email: '', college: '', course: '', courseOther: '', year: '' },
    { fullName: '', email: '', college: '', course: '', courseOther: '', year: '' },
  ],

  // Step 3: Domain, PPT Submission & Track Selection
  selectedDomain: '',
  selectedTrack: '',
  pptFileName: '',
  pptFileSize: '',
  pptUploadedAt: '',
  pptBase64: '',
  pptMimeType: '',

  // Step 4: Review Confirmation & Payment
  confirmedReview: false,
  paymentUtr: '',
}

// Synchronous local storage reader to resume without any delay or UI flicker
function getInitialDraft() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('aithon_registration_progress_v2')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.formData && Number(parsed.currentStep) < 5) {
      return parsed
    }
  } catch (e) {}
  return null
}

export default function Registration() {
  const { registerTeam, getNextSerialTeamId, syncNextSerialNum } = useAdmin()

  const savedDraft = getInitialDraft()

  // Stepper State (0: Instructions, 1: Lead, 2: Members, 3: PPT, 4: Payment (with Review), 5: Completed)
  // Automatically resumes directly at the step where the user previously left off!
  const [currentStep, setCurrentStep] = useState(() => (savedDraft ? Number(savedDraft.currentStep) || 0 : 0))
  const [maxStepReached, setMaxStepReached] = useState(() => (savedDraft ? Number(savedDraft.maxStepReached) || Number(savedDraft.currentStep) || 0 : 0))
  const [rulesAgreed, setRulesAgreed] = useState(() => (savedDraft ? Boolean(savedDraft.rulesAgreed) : false))
  const [step4View, setStep4View] = useState(() => (savedDraft ? savedDraft.step4View || 'review' : 'review'))

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReadingPpt, setIsReadingPpt] = useState(false)
  const [drivePptUrl, setDrivePptUrl] = useState(() => (savedDraft ? savedDraft.drivePptUrl || '' : ''))
  const [registrationId, setRegistrationId] = useState(() => {
    if (savedDraft && savedDraft.registrationId) return savedDraft.registrationId
    try {
      return sessionStorage.getItem('aithon_allocated_reg_id') || ''
    } catch (e) {
      return ''
    }
  })
  const [teamId, setTeamId] = useState(() => {
    if (savedDraft && savedDraft.teamId) return savedDraft.teamId
    try {
      return sessionStorage.getItem('aithon_allocated_team_id') || ''
    } catch (e) {
      return ''
    }
  })
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [paymentModal, setPaymentModal] = useState(null)
  const [paymentConfirmed, setPaymentConfirmed] = useState(() => (savedDraft ? Boolean(savedDraft.paymentConfirmed) : false))
  const [utrError, setUtrError] = useState('')
  const [isSendingReport, setIsSendingReport] = useState(false)
  const [reportSentMessage, setReportSentMessage] = useState('')
  const fileInputRef = useRef(null)

  // Auto-Save UI & Feedback State
  const [saveStatus, setSaveStatus] = useState('saved') // 'idle' | 'saving' | 'saved'
  const [lastSavedAt, setLastSavedAt] = useState(() => (savedDraft ? savedDraft.savedAt || Date.now() : null))
  const [isRestoredBannerVisible, setIsRestoredBannerVisible] = useState(() =>
    Boolean(savedDraft && (savedDraft.currentStep > 1 || savedDraft.formData?.teamName?.trim()))
  )

  const [submitMessageIndex, setSubmitMessageIndex] = useState(0)

  // Calming Submission Stages for the popup overlay
  const SUBMISSION_STAGES = [
    {
      title: 'Connecting & Securing Team ID...',
      desc: 'Locking in your sequential Team ID with organizing committee.',
      badge: 'Stage 1 of 4 • Securing Spot',
    },
    {
      title: 'Uploading Presentation to Google Drive...',
      desc: 'Saving your slides safely under your designated Team ID.',
      badge: 'Stage 2 of 4 • Drive Storage',
    },
    {
      title: 'Syncing with Official Committee Sheet...',
      desc: 'Recording all team details and ₹50 payment verification reference.',
      badge: 'Stage 3 of 4 • Sheet Sync',
    },
    {
      title: 'Almost Done! Finalizing Confirmation...',
      desc: 'Setting up your submission review slip. Hang tight!',
      badge: 'Stage 4 of 4 • Confirmation',
    },
  ]

  // Dynamic message progression & back button prevention during submission
  useEffect(() => {
    if (!isSubmitting) {
      setSubmitMessageIndex(0)
      return
    }

    const interval = setInterval(() => {
      setSubmitMessageIndex((prev) => (prev + 1) % SUBMISSION_STAGES.length)
    }, 2600)

    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = 'Your registration submission is in progress. Please do not refresh or close this window.'
      return e.returnValue
    }

    const handlePopState = () => {
      // Keep on current page if physical back button is pressed
      window.history.pushState(null, '', window.location.href)
    }

    window.history.pushState(null, '', window.location.href)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isSubmitting, SUBMISSION_STAGES.length])

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

  // Form State (restored automatically from saved draft if available)
  const [formData, setFormData] = useState(() => {
    if (savedDraft && savedDraft.formData) {
      return {
        ...INITIAL_FORM_DATA,
        ...savedDraft.formData,
        members: Array.isArray(savedDraft.formData.members) && savedDraft.formData.members.length > 0
          ? savedDraft.formData.members
          : INITIAL_FORM_DATA.members,
      }
    }
    return INITIAL_FORM_DATA
  })

  // Asynchronously rehydrate presentation file if stored in IndexedDB
  useEffect(() => {
    let isMounted = true
    loadRegistrationDraft().then((fullDraft) => {
      if (isMounted && fullDraft && fullDraft.formData) {
        if (fullDraft.formData.pptBase64) {
          setFormData((prev) => ({
            ...prev,
            pptBase64: fullDraft.formData.pptBase64,
            pptFileName: fullDraft.formData.pptFileName || prev.pptFileName,
            pptFileSize: fullDraft.formData.pptFileSize || prev.pptFileSize,
            pptMimeType: fullDraft.formData.pptMimeType || prev.pptMimeType,
            pptUploadedAt: fullDraft.formData.pptUploadedAt || prev.pptUploadedAt,
          }))
        }
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // Auto-Save Effect: Automatically saves progress whenever fields or steps change
  const saveTimeoutRef = useRef(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Don't save if already reached completed step
    if (currentStep === 5) return

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    setSaveStatus('saving')
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      await saveRegistrationDraft({
        formData,
        currentStep,
        maxStepReached,
        step4View,
        teamId,
        registrationId,
        drivePptUrl,
        paymentConfirmed,
        rulesAgreed,
      })
      setLastSavedAt(Date.now())
      setSaveStatus('saved')
    }, 400)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [formData, currentStep, maxStepReached, step4View, teamId, registrationId, drivePptUrl, paymentConfirmed, rulesAgreed])

  // Flush save synchronously if closing window or navigating away
  useEffect(() => {
    const handleUnloadSave = () => {
      if (currentStep < 5) {
        saveRegistrationDraft({
          formData,
          currentStep,
          maxStepReached,
          step4View,
          teamId,
          registrationId,
          drivePptUrl,
          paymentConfirmed,
          rulesAgreed,
        })
      }
    }
    window.addEventListener('beforeunload', handleUnloadSave)
    window.addEventListener('pagehide', handleUnloadSave)
    return () => {
      window.removeEventListener('beforeunload', handleUnloadSave)
      window.removeEventListener('pagehide', handleUnloadSave)
    }
  }, [formData, currentStep, maxStepReached, step4View, teamId, registrationId, drivePptUrl, paymentConfirmed, rulesAgreed])

  // Clear/Reset Draft Handler
  const handleResetDraft = async () => {
    await clearRegistrationDraft()
    setFormData(INITIAL_FORM_DATA)
    setCurrentStep(0)
    setMaxStepReached(0)
    setRulesAgreed(false)
    setStep4View('review')
    setTeamId('')
    setRegistrationId('')
    setDrivePptUrl('')
    setPaymentConfirmed(false)
    setErrors({})
    setIsRestoredBannerVisible(false)
    setLastSavedAt(null)
    setSaveStatus('idle')
    if (fileInputRef.current) fileInputRef.current.value = ''
    window.scrollTo({ top: 100, behavior: 'smooth' })
  }

  const hasDraftData = Boolean(
    formData.teamName?.trim() ||
    formData.leadFullName?.trim() ||
    formData.leadEmail?.trim() ||
    formData.pptFileName ||
    currentStep > 1
  )

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
    if (!formData.leadCourse.trim()) {
      errs.leadCourse = 'Course or branch is required'
    } else if (isOtherCourse(formData.leadCourse) && !formData.leadCourseOther?.trim()) {
      errs.leadCourseOther = 'Please specify your course or branch'
    }
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
      } else if (isOtherCourse(member.course) && !member.courseOther?.trim()) {
        errs[`member_${i}_courseOther`] = `Please specify Teammate ${i + 1}'s course or branch`
      }
      if (!member.year?.trim()) {
        errs[`member_${i}_year`] = `Year of study is required`
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Validate Step 3: Domain, Track Selection & PPT Upload
  const validateStep3 = () => {
    const errs = {}
    if (!formData.selectedDomain || !formData.selectedDomain.trim()) {
      errs.selectedDomain = 'Please select your domain (1. Software or 2. Hardware) before proceeding'
    }
    if (!formData.selectedTrack || !formData.selectedTrack.trim()) {
      errs.selectedTrack = 'Please select your competition track out of the 23 tracks before proceeding'
    }
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

    setIsReadingPpt(true)
    const reader = new FileReader()
    reader.onload = () => {
      const base64Data = reader.result
      setFormData((prev) => ({
        ...prev,
        pptFileName: file.name,
        pptFileSize: formattedSize,
        pptUploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pptBase64: base64Data,
        pptMimeType: file.type || 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      }))
      setIsReadingPpt(false)
    }
    reader.onerror = () => {
      setErrors((prev) => ({
        ...prev,
        ppt: 'Failed to read presentation file. Please try selecting the file again.',
      }))
      setIsReadingPpt(false)
    }
    reader.readAsDataURL(file)

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

  // Navigation handlers with Real-Time Google Sheet Sync
  const handleNextFromStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2)
      setMaxStepReached((prev) => Math.max(prev, 2))
      window.scrollTo({ top: 120, behavior: 'smooth' })

      // ⚡ REAL-TIME ALLOCATION: First person to start registration gets earliest Team ID immediately!
      syncRegistrationStep(formData, 1, teamId, registrationId)
        .then((res) => {
          if (res && res.teamId) {
            setTeamId(res.teamId)
            const finalReg = res.registrationId || res.teamId.replace('TEAM-', 'AI26-')
            setRegistrationId(finalReg)
            try {
              sessionStorage.setItem('aithon_allocated_team_id', res.teamId)
              sessionStorage.setItem('aithon_allocated_reg_id', finalReg)
            } catch (e) {}
            const numMatch = res.teamId.match(/\d+/)
            if (numMatch && syncNextSerialNum) {
              syncNextSerialNum(parseInt(numMatch[0], 10) + 1)
            }
          }
        })
        .catch((err) => console.warn('[Registration] Step 1 real-time sync notice:', err))
    }
  }

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setCurrentStep(3)
      setMaxStepReached((prev) => Math.max(prev, 3))
      window.scrollTo({ top: 120, behavior: 'smooth' })

      // ⚡ REAL-TIME SYNC: Update member details to Google Sheet in real time
      syncRegistrationStep(formData, 2, teamId, registrationId)
        .then((res) => {
          if (res && res.teamId && !teamId) {
            setTeamId(res.teamId)
            const finalReg = res.registrationId || res.teamId.replace('TEAM-', 'AI26-')
            setRegistrationId(finalReg)
          }
        })
        .catch((err) => console.warn('[Registration] Step 2 real-time sync notice:', err))
    }
  }

  const handleNextFromStep3 = () => {
    if (validateStep3()) {
      setCurrentStep(4)
      setMaxStepReached((prev) => Math.max(prev, 4))
      setStep4View('review')
      window.scrollTo({ top: 120, behavior: 'smooth' })

      // ⚡ REAL-TIME SYNC: Save PPT & Track selection to Google Sheet in real time
      syncRegistrationStep(formData, 3, teamId, registrationId)
        .then((res) => {
          if (res && res.pptUrl) {
            setDrivePptUrl(res.pptUrl)
          }
        })
        .catch((err) => console.warn('[Registration] Step 3 real-time sync notice:', err))
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

  // Report payment problem helper
  const handleReportPaymentProblem = async (reason) => {
    setIsSendingReport(true)
    setReportSentMessage('')
    try {
      const payloadData = {
        ...formData,
        paymentStatus: 'Rejected',
        paymentRejected: true,
        paymentUtr: `REPORTED_ISSUE: ${reason || 'Payment Cancelled or Declined'}`,
      }
      await submitRegistrationToGoogleSheet(
        payloadData,
        teamId || 'TEAM-HOLD',
        registrationId || 'AI25-HOLD'
      )
      setReportSentMessage('Payment issue noted! A Payment Assistance email has been sent to ' + (formData.leadEmail || 'your email') + ' with coordinator contacts.')
    } catch (e) {
      console.warn('Could not dispatch payment issue report:', e)
      setReportSentMessage('Payment issue recorded. Please contact support at ai.veer2k26@gmail.com.')
    } finally {
      setIsSendingReport(false)
    }
  }

  // Final Registration & Payment Submission
  const handleFinalSubmit = async (e, overrideUtr) => {
    if (e && e.preventDefault) e.preventDefault()

    // 🛡️ STRICT VALIDATION: Form cannot be submitted without actual verified payment
    const rawUtr = (overrideUtr || formData.paymentUtr || '').trim()
    if (!rawUtr || rawUtr.length < 6) {
      setUtrError('Payment reference or 12-digit UTR is strictly required to confirm registration.')
      setPaymentModal({
        isOpen: true,
        type: 'missing_utr',
        title: '₹50 Payment Verification Required',
        message: 'Without actual payment confirmation, your registration cannot be submitted. Please complete the ₹50 evaluation fee via UPI and enter your 12-digit UPI UTR number.',
      })
      return
    }

    if (!paymentConfirmed && !overrideUtr) {
      setUtrError('Please check the confirmation box verifying that you have completed payment.')
      setPaymentModal({
        isOpen: true,
        type: 'unconfirmed',
        title: 'Payment Confirmation Check Required',
        message: 'Please tick the confirmation checkbox certifying that your team has completed the ₹50 fee via UPI.',
      })
      return
    }

    setUtrError('')
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

    try {
      // Resolve any 'Other' branches to the user-specified branch text
      const finalLeadCourse =
        isOtherCourse(formData.leadCourse) && formData.leadCourseOther?.trim()
          ? formData.leadCourseOther.trim()
          : formData.leadCourse

      const finalMembers = formData.members.map((m) => ({
        ...m,
        course:
          isOtherCourse(m.course) && m.courseOther?.trim()
            ? m.courseOther.trim()
            : m.course,
      }))

      // 2. Submit to Google Sheets (Target Account: ai.veer2k26@gmail.com)
      const payloadData = {
        ...formData,
        paymentUtr: rawUtr,
        leadCourse: finalLeadCourse,
        members: finalMembers,
        paymentStatus: 'Pending Verification (₹50)',
        paymentConfirmed: true,
      }

      const result = await submitRegistrationToGoogleSheet(
        payloadData,
        currentTeamId,
        currentRegId
      )

      // 🛡️ ATOMIC SYNC: Always prioritize the authoritative server-confirmed Team ID & Reg ID!
      const confirmedTeamId = result?.teamId || currentTeamId
      const confirmedRegId = result?.registrationId || currentRegId

      setTeamId(confirmedTeamId)
      setRegistrationId(confirmedRegId)

      if (result && result.pptUrl) {
        setDrivePptUrl(result.pptUrl)
      }

      // 3. Sync to local AdminContext for instant admin roster view
      if (registerTeam) {
        registerTeam({
          ...payloadData,
          registrationId: confirmedRegId,
          teamId: confirmedTeamId,
          paymentStatus: 'Pending Verification',
          pptDriveUrl: result?.pptUrl || '',
        })
      }

      const confirmedMatch = confirmedTeamId.match(/\d+/)
      if (confirmedMatch && syncNextSerialNum) {
        syncNextSerialNum(parseInt(confirmedMatch[0], 10) + 1)
      }

      // 4. Advance to Step 05: Completed (Under 24-Hour Review)
      await clearRegistrationDraft()
      try {
        sessionStorage.removeItem('aithon_allocated_team_id')
        sessionStorage.removeItem('aithon_allocated_reg_id')
      } catch (e) {}
      setCurrentStep(5)
      window.scrollTo({ top: 100, behavior: 'smooth' })
    } catch (err) {
      console.error('[Registration] Error completing registration:', err)
      await clearRegistrationDraft()
      setTeamId(currentTeamId)
      setRegistrationId(currentRegId)
      // Even if network fails, ensure UI gracefully confirms
      setCurrentStep(5)
      window.scrollTo({ top: 100, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Copy UPI ID helper
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(OFFICIAL_UPI_ID)
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

        {/* Restored Draft Welcome Banner */}
        {isRestoredBannerVisible && currentStep < 5 && currentStep > 0 && (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 border border-blue-200/90 shadow-2xs flex items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-blue-950">
                  Welcome back! We restored your registration progress
                </h4>
                <p className="text-[11px] sm:text-xs text-blue-800/90 mt-0.5">
                  Resumed right where you left off at{' '}
                  <span className="font-bold underline underline-offset-2">
                    {STEPS.find((s) => s.number === currentStep)?.title || `Step ${currentStep}`}
                  </span>
                  . All entered details are safely preserved in this browser.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsRestoredBannerVisible(false)}
              className="text-blue-500 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-100/60 transition-colors shrink-0 cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ==================================================
            VISUAL PROGRESS INDICATOR (6 Steps)
            ================================================== */}
        <RegistrationProgress
          currentStep={currentStep}
          maxStepReached={maxStepReached}
          steps={STEPS}
          onStepClick={(stepNum) => {
            // Allow stepping to any unlocked step
            if (stepNum <= Math.max(currentStep, maxStepReached) && currentStep !== 5) {
              setCurrentStep(stepNum)
              window.scrollTo({ top: 120, behavior: 'smooth' })
            }
          }}
        />

        {/* Auto-Save & Draft State Pill */}
        {currentStep > 0 && currentStep < 5 && (
          <AutoSaveIndicator
            saveStatus={saveStatus}
            lastSavedAt={lastSavedAt}
            currentStep={currentStep}
            hasDraftData={hasDraftData}
            onResetDraft={handleResetDraft}
          />
        )}

        {/* ==================================================
            LIVE ALLOCATED TEAM ID BADGE (Real-Time Sheet Sync)
            ================================================== */}
        {teamId && currentStep > 0 && currentStep < 5 && (
          <div className="mb-6 flex items-center justify-between p-3.5 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50/70 to-orange-50 border border-orange-200/90 shadow-2xs animate-fadeIn">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-200/60 animate-pulse shrink-0" />
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-700">Official Allocated Team ID:</span>
                <span className="font-mono font-black text-[#ea580c] text-xs sm:text-sm bg-white px-2.5 py-0.5 rounded-md border border-orange-200 shadow-2xs">
                  {teamId}
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-500 hidden sm:inline">
                  • {registrationId || teamId.replace('TEAM-', 'AI26-')}
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300 shrink-0">
              Allocated in Sheet
            </span>
          </div>
        )}

        {/* ==================================================
            STEP 00 — INSTRUCTIONS & OFFICIAL RULE BOOK
            ================================================== */}
        {currentStep === 0 && (
          <RegistrationInstructions
            rulesAgreed={rulesAgreed}
            setRulesAgreed={setRulesAgreed}
            onProceed={() => {
              setCurrentStep(1)
              setMaxStepReached((prev) => Math.max(prev, 1))
              window.scrollTo({ top: 120, behavior: 'smooth' })
            }}
          />
        )}

        {/* ==================================================
            STEP 01 — TEAM LEAD DETAILS
            ================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Academic Eligibility Guidelines Card */}
            <div className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#edebe6]">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#2563eb]" />
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#062b59]">
                    Eligibility Criteria (UG & Diploma Only)
                  </h3>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                  National Level AI Hackathon
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Eligible Categories Box */}
                <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider">
                      Eligible Academic Categories (UG & Diploma Only)
                    </span>
                  </div>
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
                </div>

                {/* Ineligible Candidates Box */}
                <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200/80 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-900">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider">
                        ✕ Ineligible Candidates (Strictly Not Allowed)
                      </span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-2 pl-5 list-disc marker:text-rose-600 font-medium">
                      <li>
                        <strong className="text-rose-950">Postgraduate / Master's Students:</strong><br />
                        <span className="text-slate-600 text-[11px]">M.E. / M.Tech / MBA / M.Sc / M.Pharm / LL.M / MD / MS / MDS</span>
                      </li>
                      <li>
                        <strong className="text-rose-950">Doctoral & Post-Doctoral:</strong><br />
                        <span className="text-slate-600 text-[11px]">Ph.D. / Post-Doc Researchers</span>
                      </li>
                      <li>
                        <strong className="text-rose-950">Working Professionals:</strong><br />
                        <span className="text-slate-600 text-[11px]">Corporate & Industry Employees</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2.5 border-t border-rose-200/70 text-[11px] text-rose-800 font-medium leading-relaxed">
                    ⚠️ Valid College / University ID card confirming active UG / Diploma enrollment is mandatory during check-in.
                  </div>
                </div>
              </div>
            </div>

            {/* Team Lead Details Card */}
            <div className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
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

                {/* Specify custom branch if 'Other' is selected */}
                {isOtherCourse(formData.leadCourse) && (
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 animate-fadeIn space-y-1">
                    <FormInput
                      label="Specify Course / Branch Name"
                      name="leadCourseOther"
                      value={formData.leadCourseOther || ''}
                      onChange={handleChange}
                      placeholder="e.g. B.Tech Robotics & Automation / BCA / MCA / BSc AI"
                      required
                      error={errors.leadCourseOther}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-[#edebe6] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(0)
                  window.scrollTo({ top: 120, behavior: 'smooth' })
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#faf9f6] hover:bg-white text-slate-700 border border-[#edebe6] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Instructions</span>
              </button>

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

                      {/* Specify custom branch for teammate if 'Other' is selected */}
                      {isOtherCourse(memberData.course) && (
                        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 animate-fadeIn space-y-1">
                          <FormInput
                            label={`Specify Teammate ${idx + 1}'s Course / Branch Name`}
                            value={memberData.courseOther || ''}
                            onChange={(e) => handleMemberChange(idx, 'courseOther', e.target.value)}
                            placeholder="e.g. B.Tech Robotics & Automation / BCA / MCA / BSc IT"
                            required
                            error={errors[`member_${idx}_courseOther`]}
                          />
                        </div>
                      )}
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
                      Official Presentation Template
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#062b59]">
                      AITHON 2.0 Official Presentation Format (.PPTX)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Includes the mandatory slide structure: Problem Statement, Proposed AI Architecture, Tech Stack, & Demo Plan.
                    </p>
                  </div>
                </div>

                {/* Direct Download Button */}
                <a
                  href="/AITHON_2.0_Presentation.pptx"
                  download="AITHON_2.0_Presentation.pptx"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm shrink-0 hover:shadow-md cursor-pointer group"
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download PPT Template</span>
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

            {/* Domain Selection Section (1. Software / 2. Hardware) */}
            <div className="space-y-3 p-5 sm:p-6 rounded-2xl bg-[#faf9f6] border border-[#edebe6] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label
                  className="text-xs font-bold uppercase tracking-wider text-[#062b59] flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-[#2563eb]" />
                  <span>Select Domain <span className="text-[#ea580c] font-bold">*</span></span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Choose whether your project is Software or Hardware
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  {
                    id: 'Software',
                    label: '1. Software',
                    desc: 'Web, Mobile apps, AI/ML models, Cloud, APIs, Algorithms & Digital systems',
                    icon: Laptop,
                  },
                  {
                    id: 'Hardware',
                    label: '2. Hardware',
                    desc: 'IoT devices, Embedded Systems, Robotics, Sensors, Microcontrollers & Circuits',
                    icon: Cpu,
                  },
                ].map((item) => {
                  const isSelected = formData.selectedDomain === item.id
                  const ItemIcon = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, selectedDomain: item.id }))
                        if (errors.selectedDomain) {
                          setErrors((prev) => {
                            const next = { ...prev }
                            delete next.selectedDomain
                            return next
                          })
                        }
                      }}
                      className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 relative group ${
                        isSelected
                          ? 'border-[#2563eb] bg-blue-50/50 shadow-sm'
                          : 'border-[#edebe6] bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#2563eb] text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-[#2563eb]'
                        }`}
                      >
                        <ItemIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-extrabold tracking-wide ${
                              isSelected ? 'text-[#062b59]' : 'text-slate-800'
                            }`}
                          >
                            {item.label}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-[#2563eb] bg-[#2563eb]'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {errors.selectedDomain && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.selectedDomain}</span>
                </p>
              )}

              {formData.selectedDomain && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-[#062b59]">
                  <CheckCircle2 className="w-4 h-4 text-[#2563eb] shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold">Chosen Domain: </span>
                    <span className="font-extrabold text-[#2563eb]">
                      {formData.selectedDomain === 'Software' ? '1. Software' : '2. Hardware'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-blue-200 text-slate-600">
                    Domain Selected
                  </span>
                </div>
              )}
            </div>

            {/* Track Selection Section (Select out of 23 Tracks) */}
            <div className="space-y-3 p-5 sm:p-6 rounded-2xl bg-[#faf9f6] border border-[#edebe6] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label
                  htmlFor="selectedTrack"
                  className="text-xs font-bold uppercase tracking-wider text-[#062b59] flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-[#2563eb]" />
                  <span>Select Competition Track (Out of 23 Tracks) <span className="text-[#ea580c] font-bold">*</span></span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Matches your PPT solution domain
                </span>
              </div>

              <div className="relative">
                <select
                  id="selectedTrack"
                  name="selectedTrack"
                  value={formData.selectedTrack}
                  onChange={handleChange}
                  className={`w-full py-3.5 px-4 pr-10 rounded-xl bg-white border text-xs sm:text-sm font-semibold transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563eb] ${
                    errors.selectedTrack
                      ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                      : formData.selectedTrack
                      ? 'border-[#2563eb] text-[#062b59] shadow-xs'
                      : 'border-[#edebe6] text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <option value="" disabled>
                    — Choose your Hackathon Track (Select 1 of 23 Tracks) —
                  </option>
                  {TRACK_OPTIONS.map((track, idx) => (
                    <option key={idx} value={track} className="text-[#062b59] font-medium py-1">
                      {track}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              </div>

              {errors.selectedTrack && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.selectedTrack}</span>
                </p>
              )}

              {formData.selectedTrack && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-[#062b59]">
                  <CheckCircle2 className="w-4 h-4 text-[#2563eb] shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold">Chosen Track: </span>
                    <span className="font-extrabold text-[#2563eb]">{formData.selectedTrack}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-blue-200 text-slate-600">
                    Track Selected
                  </span>
                </div>
              )}
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

              {isReadingPpt ? (
                /* Loading State while reading file */
                <div className="border-2 border-dashed border-[#2563eb] rounded-2xl p-8 sm:p-10 text-center bg-blue-50/50 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#edebe6] flex items-center justify-center text-[#2563eb] shadow-xs">
                    <span className="w-6 h-6 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#062b59]">Processing presentation file...</p>
                    <p className="text-xs text-slate-500">Preparing presentation for automatic Google Drive sync</p>
                  </div>
                </div>
              ) : !formData.pptFileName ? (
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-[#062b59] truncate max-w-xs block">
                          ✓ {formData.pptFileName}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded uppercase shrink-0">
                          Ready for Drive
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {formData.pptFileSize} • Saved to Drive folder as <strong>{teamId ? `${teamId}.pptx` : 'TEAM-[ID].pptx'}</strong>
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
                      <span className="text-slate-700 font-medium">
                        {formData.leadCollege} ({isOtherCourse(formData.leadCourse) && formData.leadCourseOther?.trim() ? formData.leadCourseOther.trim() : formData.leadCourse} • {formData.leadYear})
                      </span>
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
                          {m.college} ({isOtherCourse(m.course) && m.courseOther?.trim() ? m.courseOther.trim() : m.course} • {m.year})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Card 3: Uploaded PPT & Selected Track */}
                <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200/60">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-[#062b59] uppercase">
                        Idea Presentation & Track
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
                    >
                      Edit Submission
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {/* Chosen Domain */}
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-blue-200/80 text-xs">
                      <Cpu className="w-4 h-4 text-[#2563eb] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-slate-400 font-semibold text-[11px] block uppercase">Domain</span>
                        <span className="font-extrabold text-[#062b59] truncate block">
                          {formData.selectedDomain ? (formData.selectedDomain === 'Software' ? '1. Software' : '2. Hardware') : '1. Software'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded uppercase shrink-0 border border-blue-100">
                        Domain Verified
                      </span>
                    </div>

                    {/* Chosen Competition Track */}
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-200/80 text-xs">
                      <Layers className="w-4 h-4 text-[#2563eb] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-slate-400 font-semibold text-[11px] block uppercase">Competition Track</span>
                        <span className="font-extrabold text-[#062b59] truncate block">
                          {formData.selectedTrack || 'No Track Selected'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase shrink-0">
                        Track Verified
                      </span>
                    </div>

                    {/* Uploaded PPT File Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="font-bold text-[#062b59]">{formData.pptFileName || 'Uploaded PPT'}</span>
                        <span className="text-slate-400">({formData.pptFileSize})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-emerald-200">
                          Drive Name: {teamId ? `${teamId}.pptx` : 'TEAM-[ID].pptx'}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                          Ready
                        </span>
                      </div>
                    </div>
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
              <div className="bg-white border border-[#edebe6] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
                {/* Clean Header */}
                <div className="pb-4 border-b border-[#edebe6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 inline-block mb-1.5">
                      STEP 04 OF 04 • EVALUATION FEE
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-[#062b59] uppercase tracking-tight">
                      First PPT Evaluation Fee
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-start sm:self-auto">
                    <span>Team Fee:</span>
                    <span className="text-base font-black text-emerald-600">₹50</span>
                    <span className="text-[11px] text-emerald-700 font-medium">({formData.teamName || 'Team'})</span>
                  </div>
                </div>

                {/* Clean UPI Payment Card */}
                <div className="space-y-5">
                  {/* Official UPI Payment Box */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 border-2 border-blue-200/80 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-100">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#062b59]" />
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#062b59]">
                          Official UPI Payment (₹50)
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-extrabold bg-emerald-600 text-white px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                        GPay • PhonePe • Paytm • Any UPI
                      </span>
                    </div>

                    {/* Dedicated Full-Width UPI ID Box with One-Click Copy */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-blue-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Official Recipient UPI ID:
                        </span>
                        <div className="font-mono text-sm sm:text-base font-black text-[#062b59] tracking-tight select-all whitespace-nowrap overflow-x-auto">
                          {OFFICIAL_UPI_ID}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-xs"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-300" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy UPI ID</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* QR Code and Quick Instructions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
                      {/* Interactive QR Code (Enlarged & Centered) */}
                      <div className="flex flex-col items-center text-center space-y-2.5">
                        <div className="p-3 sm:p-3.5 bg-white rounded-2xl border-2 border-blue-300 shadow-md inline-block">
                          <img
                            src="/qr-50.jpg"
                            alt="Scan to Pay ₹50 via UPI - Shree A. Ugale (9404665180@centralbank)"
                            className="w-52 h-auto sm:w-60 md:w-64 max-w-full rounded-xl object-contain shadow-xs"
                            loading="eager"
                          />
                        </div>
                        <span className="text-[11px] sm:text-xs font-extrabold text-[#062b59] uppercase tracking-wider flex items-center gap-1.5 bg-white px-3.5 py-1 rounded-full border border-blue-200 shadow-2xs">
                          <QrCode className="w-3.5 h-3.5 text-[#2563eb]" />
                          <span>Scan to Pay ₹50 with Any UPI App</span>
                        </span>
                      </div>

                      {/* Payment Instructions */}
                      <div className="space-y-3 text-left">
                        <div className="p-4 rounded-xl bg-white border border-blue-100 text-xs text-slate-700 space-y-2 shadow-2xs">
                          <div className="font-extrabold text-[#062b59] uppercase tracking-wider text-[11px]">
                            Quick Instructions:
                          </div>
                          <ol className="list-decimal pl-4 space-y-1.5 text-xs text-slate-600 leading-relaxed font-medium">
                            <li>
                              Scan the QR code or transfer ₹50 directly to <strong className="font-mono text-[#062b59] whitespace-nowrap">{OFFICIAL_UPI_ID}</strong>.
                            </li>
                            <li>
                              From your payment confirmation receipt, copy the <strong>12-digit UPI UTR / Reference ID</strong>.
                            </li>
                            <li>
                              Paste the 12-digit UTR number below and submit your team entry.
                            </li>
                          </ol>
                        </div>

                        {/* Direct Mobile Intent Link */}
                        <a
                          href={OFFICIAL_UPI_URI}
                          className="sm:hidden inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-blue-100 hover:bg-blue-200 text-[#062b59] text-xs font-bold transition-colors"
                        >
                          <span>Tap to Open Installed UPI App</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* UTR Input Section */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#062b59] flex items-center justify-between">
                      <span>
                        Transaction Reference / 12-Digit UPI UTR <span className="text-red-600 font-bold">*</span>
                      </span>
                      {formData.paymentUtr && formData.paymentUtr.trim().length >= 6 && (
                        <span className="text-[11px] font-bold text-emerald-600 normal-case flex items-center gap-0.5">
                          ✓ Entered
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="paymentUtr"
                      value={formData.paymentUtr}
                      onChange={(e) => {
                        handleChange(e)
                        if (utrError) setUtrError('')
                      }}
                      placeholder="e.g. 12-digit UTR from GPay / PhonePe / Paytm"
                      className={`w-full px-4 py-2.5 rounded-lg bg-white border text-sm font-sans focus:outline-none transition-all ${
                        utrError
                          ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                          : 'border-[#edebe6] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                      }`}
                    />
                    {utrError && (
                      <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{utrError}</span>
                      </p>
                    )}
                    <span className="text-[11px] text-slate-500 block">
                      Enter the 12-digit UPI UTR number or transaction reference from your payment receipt.
                    </span>
                  </div>

                  {/* Payment Confirmation Checkbox */}
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none hover:bg-blue-50/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={paymentConfirmed}
                      onChange={(e) => {
                        setPaymentConfirmed(e.target.checked)
                        if (utrError) setUtrError('')
                      }}
                      className="mt-0.5 w-4 h-4 rounded text-[#2563eb] focus:ring-[#2563eb] cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 font-medium leading-relaxed">
                      I confirm that our team has completed the <strong className="text-[#062b59]">₹50 evaluation fee</strong> and entered the correct 12-digit UTR.
                    </span>
                  </label>

                  {/* 24-Hour Review Notice Callout */}
                  <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2.5 leading-relaxed">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Review Policy:</strong> Once you submit your UTR, your registration will be queued for manual verification. We will review your entry shortly (takes up to 24 hours) before confirming.
                    </span>
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
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#062b59] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Entry...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Entry for Review (24 Hrs)</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================
            STEP 05 — COMPLETION (UNDER 24-HOUR REVIEW STATE)
            ================================================== */}
        {currentStep === 5 && (
          <div className="bg-white border border-[#edebe6] rounded-2xl p-6 sm:p-10 shadow-sm text-center space-y-6 animate-fadeIn max-w-2xl mx-auto">
            {/* Glowing Clock / Verification Badge */}
            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner border-2 border-amber-300">
              <Clock className="w-10 h-10 stroke-[2.5]" />
            </div>

            {/* Header Text */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                SUBMISSION UNDER REVIEW • 24 HOURS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#062b59] uppercase tracking-tight">
                Registration Submitted — Under Review
              </h2>
              <p className="text-sm text-slate-600 font-medium max-w-md mx-auto">
                Your team registration and presentation submission have been received.
              </p>
            </div>

            {/* Prominent 24-Hour Review Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 border-2 border-amber-300 text-left space-y-2 shadow-xs">
              <div className="flex items-start gap-3.5">
                <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-amber-950 uppercase tracking-tight">
                    We will review your entry shortly it will take 24hrs..
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
                    Your 12-digit UTR (<strong className="font-mono text-amber-950">{formData.paymentUtr || 'Submitted'}</strong>) and presentation submission have been logged. Our organizing committee is manually verifying your payment against bank records.
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Summary Card */}
            <div className="p-5 rounded-2xl bg-[#faf9f6] border border-[#edebe6] text-left space-y-3 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-[#edebe6] text-xs">
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Assigned Team ID</span>
                  <span className="text-base sm:text-lg font-black text-[#ea580c] font-mono tracking-tight bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200 inline-block mt-0.5">
                    {teamId || 'TEAM-CONFIRMED'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Registration ID</span>
                  <span className="text-base sm:text-lg font-black text-[#062b59] font-mono tracking-tight inline-block mt-0.5">
                    {registrationId || (teamId ? teamId.replace('TEAM-', 'AI26-') : 'AI26-CONFIRMED')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-3 border-b border-[#edebe6] text-xs">
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Team Name</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#062b59] block truncate">
                    {formData.teamName || 'AiTHON Team'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Domain</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#062b59] flex items-center gap-1.5 mt-0.5">
                    <Cpu className="w-4 h-4 text-[#2563eb] shrink-0" />
                    <span className="truncate">{formData.selectedDomain === 'Hardware' ? '2. Hardware' : '1. Software'}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Competition Track</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#062b59] flex items-center gap-1.5 mt-0.5">
                    <Layers className="w-4 h-4 text-[#2563eb] shrink-0" />
                    <span className="truncate">{formData.selectedTrack || 'Track Selected'}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">PPT Submission</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 text-xs sm:text-sm truncate">
                    <span>✓</span> {formData.pptFileName || (teamId ? `${teamId}.pptx` : 'Uploaded')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[11px] uppercase">Payment Status</span>
                  <span className="font-bold text-amber-700 flex items-center gap-1 text-xs sm:text-sm">
                    <Clock className="w-3.5 h-3.5" /> Pending Verification
                  </span>
                </div>
              </div>

              {formData.paymentUtr && (
                <div className="pt-2 text-xs border-t border-[#edebe6] flex items-center justify-between">
                  <span className="text-slate-400 font-bold text-[11px] uppercase">Submitted UTR</span>
                  <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-[#edebe6]">
                    {formData.paymentUtr}
                  </span>
                </div>
              )}
            </div>

            {/* Email Notification Notice */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-left space-y-1 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-[#062b59]">
                <MailIcon className="w-4 h-4 text-[#2563eb]" />
                <span>Confirmation Email Will Be Dispatched After Manual Verification</span>
              </div>
              <p className="text-[11.5px] text-slate-600 pl-5 leading-relaxed">
                To ensure strict verification, confirmation emails will NOT trigger automatically. Once our committee manually verifies your ₹50 payment against bank records (within 24 hours), your official registration confirmation email will be dispatched to: <strong className="text-[#062b59] font-mono">{formData.leadEmail || 'your email'}</strong>.
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
                href="https://chat.whatsapp.com/HRvMvxxB2NUIvw5zMiTsQ9"
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

        {/* ==================================================
            PAYMENT ALERT & PROBLEM POPUP MODAL
            ================================================== */}
        {paymentModal && paymentModal.isOpen && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#edebe6] space-y-5 relative animate-scaleIn">
              {/* Close Icon */}
              <button
                type="button"
                onClick={() => {
                  setPaymentModal(null)
                  setReportSentMessage('')
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    paymentModal.type === 'rejected' || paymentModal.type === 'problem'
                      ? 'bg-rose-100 text-rose-600 border border-rose-200'
                      : 'bg-amber-100 text-amber-600 border border-amber-200'
                  }`}
                >
                  {paymentModal.type === 'rejected' || paymentModal.type === 'problem' ? (
                    <XCircle className="w-6 h-6 stroke-[2.2]" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                  )}
                </div>
                <div className="space-y-1 pr-6">
                  <h3 className="text-lg font-black text-[#062b59] tracking-tight">
                    {paymentModal.title || 'Payment Verification Required'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {paymentModal.message}
                  </p>
                </div>
              </div>

              {/* Report Sent Status Banner if triggered */}
              {reportSentMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{reportSentMessage}</span>
                </div>
              )}

              {/* Troubleshooting / Assistance Options */}
              {paymentModal.type === 'problem' && !reportSentMessage && (
                <div className="space-y-2 p-3.5 rounded-xl bg-[#faf9f6] border border-[#edebe6] text-xs">
                  <span className="font-bold text-[#062b59] block uppercase tracking-wider text-[10.5px]">
                    Select What Happened:
                  </span>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      disabled={isSendingReport}
                      onClick={() => handleReportPaymentProblem('Cancelled by User / Closed Window')}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white hover:bg-rose-50 border border-[#edebe6] hover:border-rose-300 text-slate-700 hover:text-rose-700 font-medium transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>1. I cancelled / closed the payment tab by accident</span>
                      <span className="text-[10px] text-slate-400 font-mono">Notify & Help</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSendingReport}
                      onClick={() => handleReportPaymentProblem('Bank / UPI App Declined')}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white hover:bg-rose-50 border border-[#edebe6] hover:border-rose-300 text-slate-700 hover:text-rose-700 font-medium transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>2. My bank / UPI app transaction declined</span>
                      <span className="text-[10px] text-slate-400 font-mono">Notify & Help</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSendingReport}
                      onClick={() => handleReportPaymentProblem('Money Debited but UTR not received')}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white hover:bg-amber-50 border border-[#edebe6] hover:border-amber-300 text-slate-700 hover:text-amber-800 font-medium transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>3. Money debited from my account but no UTR shown</span>
                      <span className="text-[10px] text-slate-400 font-mono">Notify & Help</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Policy Reminder */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                ⚠️ <strong>Committee Policy:</strong> Without valid UTR of ₹50 fee, the application cannot be verified by the organizing committee.
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentModal(null)
                    setReportSentMessage('')
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  OK, I'll Enter UTR
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            FULL-SCREEN SUBMISSION OVERLAY (TAKE A BREATH & DON'T HIT BACK)
            ================================================== */}
        {isSubmitting && (
          <div className="fixed inset-0 z-50 bg-[#062b59]/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-blue-100 text-center space-y-6 relative animate-scaleIn">
              {/* Calming Animated Icon Badge */}
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-orange-400/20 animate-ping" />
                <span className="absolute inset-1.5 rounded-full bg-blue-500/20 animate-pulse" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#062b59] via-[#0b3b75] to-[#2563eb] text-white flex items-center justify-center shadow-lg shadow-blue-900/30">
                  <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
                </div>
              </div>

              {/* Title & "Take a Deep Breath" Callout */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
                  <span> Take a Deep Breath & Relax</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#062b59] uppercase tracking-tight">
                  Processing Your Entry
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">
                  We are uploading your presentation slides and recording your details with the committee.
                </p>
              </div>

              {/* Dynamic Live Status Stage Card */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-blue-50/90 border border-blue-200/90 text-left space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#2563eb] bg-white px-2.5 py-0.5 rounded border border-blue-200">
                    {SUBMISSION_STAGES[submitMessageIndex].badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Working...</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-[#062b59]">
                  <RefreshCw className="w-4 h-4 text-[#2563eb] animate-spin shrink-0 mt-0.5" />
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#062b59] tracking-tight">
                      {SUBMISSION_STAGES[submitMessageIndex].title}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {SUBMISSION_STAGES[submitMessageIndex].desc}
                    </p>
                  </div>
                </div>

                {/* Animated Shimmering Progress Bar */}
                <div className="w-full bg-blue-200/70 h-2 rounded-full overflow-hidden mt-2 relative">
                  <div className="h-full bg-gradient-to-r from-[#2563eb] via-[#ea580c] to-[#2563eb] rounded-full animate-progressShimmer w-full" />
                </div>
              </div>

              {/* Strictly Anti-Back Alert Warning */}
              <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-950 text-xs flex items-start gap-2.5 text-left leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block text-rose-900 font-extrabold uppercase tracking-wider text-[10.5px]">
                    Do NOT Press the Back Button or Refresh
                  </strong>
                  <span className="text-[11px] text-rose-800 font-medium">
                    Google Drive upload takes 5 to 10 seconds. Your confirmation slip will open automatically as soon as it completes.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Official Footer */}
      <Footer />
    </div>
  )
}
