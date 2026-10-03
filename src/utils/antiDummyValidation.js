/**
 * Anti-Dummy & Fraud Prevention Validation for AITHON 2.0
 * Prevents spam bots, placeholder text, fake contacts, repeated emails,
 * and bogus payment references from consuming real registration slots.
 */

// Common dummy, test, and placeholder words
export const DUMMY_WORDS = new Set([
  'test', 'testing', 'tester', 'testteam', 'dummy', 'fake', 'asdf', 'qwerty',
  'sample', 'demo', 'trial', 'none', 'null', 'temp', 'temporary', 'placeholder',
  'na', 'n/a', 'unknown', 'random', 'foo', 'bar', 'baz', 'admin', 'administrator',
  'user', 'nobody', 'xyz', 'abc', 'abcd', '123', '1234', '12345', 'aaa', 'bbb',
  'ccc', 'fakename', 'testuser', 'sampleuser', 'noone', 'nothing', 'someone'
])

// Blocked fake / disposable / test email domains
export const BLOCKED_EMAIL_DOMAINS = new Set([
  'test.com', 'testing.com', 'example.com', 'example.org', 'example.net',
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'yopmail.com', 'fake.com', 'asdf.com', 'sample.com', 'xyz.com', 'abc.com',
  'trashmail.com', 'dispostable.com', 'throwawaymail.com', 'fakeinbox.com',
  'sharklasers.com', 'getairmail.com', 'maildrop.cc'
])

// Common sequential / fake Indian 10-digit mobile patterns
export const OBVIOUS_FAKE_PHONES = new Set([
  '9876543210', '9123456789', '9012345678', '9000000000',
  '9999999999', '8888888888', '7777777777', '6666666666',
  '9898989898', '9191919191', '9090909090', '9876501234',
  '9876598765', '9812345678', '9800000000', '9100000000'
])

// Obvious dummy / test UTR sequences
export const OBVIOUS_FAKE_UTRS = new Set([
  '000000000000', '111111111111', '222222222222', '333333333333',
  '444444444444', '555555555555', '666666666666', '777777777777',
  '888888888888', '999999999999', '123456789012', '987654321012',
  '012345678901', '121212121212', '112233445566', '123123123123'
])

/**
 * Checks if a string contains obvious placeholder / keyboard smash gibberish
 */
export function isGibberishOrDummy(value) {
  if (!value || typeof value !== 'string') return true
  const clean = value.trim().toLowerCase()
  if (clean.length < 2) return true

  // Direct blacklist hit
  if (DUMMY_WORDS.has(clean)) return true

  // Substring blacklist hit (e.g. "asdfg", "test_user")
  if (/\b(asdf|qwerty|testing|dummy|fakeentry)\b/i.test(clean)) return true

  // 4 or more identical consecutive characters (e.g. "aaaa", "1111")
  const stripped = clean.replace(/[\s.-]/g, '')
  if (/([a-z0-9])\1{3,}/i.test(stripped)) return true

  // Purely non-alphabetic string when words are expected
  if (!/[a-z]/i.test(clean)) return true

  return false
}

/**
 * Validates a real person's full name (at least 2 words, genuine characters)
 */
export function validateFullName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Full name is required' }
  }
  const trimmed = name.trim()
  if (trimmed.length < 3) {
    return { valid: false, error: 'Name must be at least 3 characters long' }
  }
  if (isGibberishOrDummy(trimmed)) {
    return { valid: false, error: 'Please enter a genuine, valid full name' }
  }
  // Check for allowed characters (letters, spaces, dots, hyphens)
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
    return { valid: false, error: 'Name should only contain letters, spaces, or dots' }
  }
  // Require at least two words (First name and Last name)
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length < 2) {
    return { valid: false, error: 'Please enter both First Name and Last Name (e.g. Rahul Sharma)' }
  }
  // Each part must have minimum length unless it is an initial like "A."
  for (const part of parts) {
    if (part.length === 1 && !part.endsWith('.')) {
      return { valid: false, error: 'Each name part must contain at least 2 letters (or an initial like A.)' }
    }
    if (DUMMY_WORDS.has(part.toLowerCase())) {
      return { valid: false, error: 'Please enter a genuine, real person name' }
    }
  }
  return { valid: true }
}

/**
 * Validates team name (minimum 3 chars, not dummy/gibberish)
 */
export function validateTeamName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Team name is required' }
  }
  const trimmed = name.trim()
  if (trimmed.length < 3) {
    return { valid: false, error: 'Team name must be at least 3 characters' }
  }
  if (trimmed.length > 50) {
    return { valid: false, error: 'Team name cannot exceed 50 characters' }
  }
  if (isGibberishOrDummy(trimmed)) {
    return { valid: false, error: 'Please enter a genuine, meaningful team name' }
  }
  // Team name cannot be purely numbers
  if (!/[a-zA-Z]/.test(trimmed)) {
    return { valid: false, error: 'Team name must contain letters, not numbers only' }
  }
  return { valid: true }
}

/**
 * Validates genuine email address (syntax + blocked disposable/dummy domains)
 */
export function validateEmailAddress(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email address is required' }
  }
  const clean = email.trim().toLowerCase()
  const basicRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!basicRegex.test(clean)) {
    return { valid: false, error: 'Enter a valid email address (e.g. name@gmail.com)' }
  }

  const [username, domain] = clean.split('@')
  if (!username || !domain) {
    return { valid: false, error: 'Enter a valid email address' }
  }

  if (username.length < 3) {
    return { valid: false, error: 'Email username is too short' }
  }

  if (DUMMY_WORDS.has(username)) {
    return { valid: false, error: 'Please enter a genuine, personal email address' }
  }

  if (BLOCKED_EMAIL_DOMAINS.has(domain)) {
    return { valid: false, error: 'Temporary, disposable, or test email domains are not permitted' }
  }

  return { valid: true }
}

/**
 * Validates genuine Indian 10-digit mobile number
 */
export function validateIndianMobile(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Mobile number is required' }
  }
  const digits = phone.replace(/[\s-]/g, '')
  if (!/^[6-9]\d{9}$/.test(digits)) {
    return { valid: false, error: 'Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9' }
  }

  // All identical digits (e.g. 9999999999)
  if (/^(\d)\1{9}$/.test(digits)) {
    return { valid: false, error: 'Repeated placeholder numbers are not allowed. Enter an active mobile number' }
  }

  // Obvious fake numbers
  if (OBVIOUS_FAKE_PHONES.has(digits)) {
    return { valid: false, error: 'This appears to be a test/dummy phone number. Enter a real active contact number' }
  }

  return { valid: true }
}

/**
 * Validates college/university name
 */
export function validateCollegeName(college) {
  if (!college || typeof college !== 'string') {
    return { valid: false, error: 'College / University name is required' }
  }
  const clean = college.trim()
  if (clean.length < 4) {
    return { valid: false, error: 'Please enter your complete college or university name' }
  }
  if (isGibberishOrDummy(clean)) {
    return { valid: false, error: 'Please enter a valid institution name' }
  }
  if (!/[a-zA-Z]/.test(clean)) {
    return { valid: false, error: 'College name must contain letters' }
  }
  return { valid: true }
}

/**
 * Validates city name
 */
export function validateCityName(city) {
  if (!city || typeof city !== 'string') {
    return { valid: false, error: 'City is required' }
  }
  const clean = city.trim()
  if (clean.length < 3) {
    return { valid: false, error: 'City must be at least 3 letters' }
  }
  if (isGibberishOrDummy(clean)) {
    return { valid: false, error: 'Please enter a valid city name' }
  }
  if (!/^[a-zA-Z\s.-]+$/.test(clean)) {
    return { valid: false, error: 'City should only contain letters' }
  }
  return { valid: true }
}

/**
 * Validates 12-digit UPI UTR or bank transaction reference
 */
export function validateUtrNumber(utr) {
  if (!utr || typeof utr !== 'string') {
    return { valid: false, error: 'Payment reference or 12-digit UPI UTR is strictly required' }
  }
  const clean = utr.trim().replace(/\s+/g, '')

  // Standard UPI UTRs are strictly 12 digits numeric, some bank IMPS references are 12-18 alphanumeric
  if (clean.length < 10) {
    return { valid: false, error: 'UTR / Transaction Reference must be at least 10–12 digits (UPI UTR is 12 digits)' }
  }

  if (clean.length > 22) {
    return { valid: false, error: 'UTR / Transaction Reference is too long. Please enter the 12-digit UPI reference' }
  }

  // Check for dummy words inside UTR
  if (/(TEST|DUMMY|SAMPLE|FAKE|CASH|PENDING|LATER|NONE|ABCD|NULL|FREE|ZERO)/i.test(clean)) {
    return { valid: false, error: 'Placeholder or test UTR detected. Enter the actual 12-digit UPI UTR from your bank app receipt' }
  }

  // Reject repeating single characters like 000000000000 or 111111111111
  if (/^([a-zA-Z0-9])\1{5,}$/.test(clean)) {
    return { valid: false, error: 'Invalid UTR format: Repeating identical numbers are not valid' }
  }

  // Reject known sequential dummy patterns
  if (OBVIOUS_FAKE_UTRS.has(clean)) {
    return { valid: false, error: 'This is a sample/placeholder reference number. Enter your actual 12-digit payment UTR' }
  }

  // If numeric, standard UPI is 12 digits
  if (/^\d+$/.test(clean) && clean.length !== 12) {
    return { valid: false, error: `UPI UTR must be exactly 12 digits (you entered ${clean.length} digits)` }
  }

  return { valid: true }
}

/**
 * Validates uploaded PPT/PDF file size and structure
 */
export function validatePresentationFile(file) {
  if (!file) {
    return { valid: false, error: 'Please select your project presentation file (.ppt, .pptx, or .pdf)' }
  }
  const validExts = ['.ppt', '.pptx', '.pdf']
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()

  if (!validExts.includes(ext)) {
    return { valid: false, error: 'Invalid file format. Please upload a PowerPoint presentation (.ppt, .pptx) or PDF (.pdf)' }
  }

  // Minimum file size check: legitimate presentation must be at least 15 KB (15,360 bytes)
  if (file.size < 15 * 1024) {
    return { valid: false, error: 'Uploaded file appears to be empty or corrupted (under 15 KB). Please upload a complete presentation' }
  }

  // Maximum file size check: 25 MB
  if (file.size > 25 * 1024 * 1024) {
    return { valid: false, error: 'File size exceeds 25 MB limit. Please compress images or media in your slides' }
  }

  return { valid: true }
}

/**
 * Checks for duplicate emails across team members & lead
 */
export function checkEmailDuplicates(leadEmail, members, teamSize) {
  const count = parseInt(teamSize, 10) || 4
  const neededMembers = count - 1
  const seen = new Map()

  if (leadEmail && leadEmail.trim()) {
    seen.set(leadEmail.trim().toLowerCase(), 'Team Leader')
  }

  const errors = {}
  for (let i = 0; i < neededMembers; i++) {
    const member = members[i]
    if (!member || !member.email) continue
    const emailLower = member.email.trim().toLowerCase()
    if (!emailLower) continue

    if (seen.has(emailLower)) {
      const existingRole = seen.get(emailLower)
      errors[`member_${i}_email`] = `Duplicate email! Cannot reuse the same email as ${existingRole}. Each member must provide their own unique email address.`
    } else {
      seen.set(emailLower, `Teammate ${i + 1}`)
    }
  }

  return errors
}
