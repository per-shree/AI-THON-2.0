/**
 * AI-THON 2.0 Registration Global Configuration
 * 
 * Set IS_REGISTRATION_CLOSED to:
 * - true  : Immediately switches all buttons and the /register page to the locked/closed state.
 * - false : Re-opens the standard registration flow.
 */
export const IS_REGISTRATION_CLOSED = true;

export const REGISTRATION_CLOSED_DATA = {
  badge: 'REGISTRATIONS OFFICIALLY CLOSED',
  title: 'Round 1 Results Announced!',
  subtitle: 'Idea evaluation is complete. 105 shortlisted teams will compete in the Grand Finale on 23 October 2026.',
  highlights: [
    {
      title: 'Grand Finale Shortlist Out',
      desc: 'Technical evaluation of all submitted idea PPTs has concluded and the official shortlist is released.',
      tag: 'Announced',
    },
    {
      title: 'Finalist Confirmation',
      desc: 'Selected team leads can verify their Team ID in the shortlist and complete Grand Finale seat confirmation.',
      tag: 'Action Required',
    },
    {
      title: 'Grand Finale Event',
      desc: '12-Hour Non-stop offline hackathon at Amrutvahini College of Engineering (AVCOE), Sangamner on 23 Oct 2026.',
      tag: '23 Oct 2026',
    },
  ],
};
