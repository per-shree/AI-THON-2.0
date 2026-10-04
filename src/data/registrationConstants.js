// Official Registration Constants and Configuration for AI-THON 2.0

export const YEAR_OPTIONS = [
  '1st Year (FE / 1st Year UG / Diploma)',
  '2nd Year (SE / 2nd Year UG / Diploma)',
  '3rd Year (TE / 3rd Year UG / Diploma)',
  '4th Year (BE / Final Year 4-Yr UG)',
  '5th Year (Final Year MBBS / B.A. LL.B / Pharm.D)',
]

export const COURSE_OPTIONS = [
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

// Official UPI Payment Configuration for ₹50 Evaluation Fee (Primary & Alternative/Kotak 811)
export const OFFICIAL_UPI_ID_1 = '9404665180@centralbank'
export const OFFICIAL_UPI_URI_1 = 'upi://pay?pa=9404665180@centralbank&pn=Mr%20Shri%20Avinash%20Ugale&am=50&cu=INR&tn=AITHON%202.0%20Registration'

export const OFFICIAL_UPI_ID_2 = '7841895180@kotakbank'
export const OFFICIAL_UPI_URI_2 = 'upi://pay?pa=7841895180@kotakbank&pn=Shri%20Avinash%20Ugale&am=50&cu=INR&tn=AITHON%202.0%20Registration'

export const OFFICIAL_UPI_ID_3 = '7720092989@sbi'
export const OFFICIAL_UPI_URI_3 = 'upi://pay?pa=7720092989@sbi&pn=Sudhanshu%20Machhindra%20Rahane&am=50&cu=INR&tn=AITHON%202.0%20Registration'

export const OFFICIAL_UPI_ID_4 = '9975260955-2@ybl'
export const OFFICIAL_UPI_URI_4 = 'upi://pay?pa=9975260955-2@ybl&pn=UMESH%20MAHENDRA%20KHAIRNAR&am=50&cu=INR&tn=AITHON%202.0%20Registration'

// Backward-compatible aliases
export const OFFICIAL_UPI_ID = OFFICIAL_UPI_ID_1
export const OFFICIAL_UPI_URI = OFFICIAL_UPI_URI_1
