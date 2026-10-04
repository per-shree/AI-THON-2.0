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
  title: 'Thank You for the Overwhelming Response!',
  subtitle: 'Registrations for AI-THON 2.0 have reached maximum capacity and are now officially closed.',
  highlights: [
    {
      title: 'Review & Shortlisting',
      desc: 'Our technical evaluation panel is actively reviewing all submitted idea PPTs and team abstracts.',
      tag: 'In Progress',
    },
    {
      title: 'Confirmation Emails',
      desc: 'Selected team leads will receive official shortlisting emails & WhatsApp announcements soon.',
      tag: 'Coming Soon',
    },
    {
      title: 'Already Registered?',
      desc: 'Please ensure you have saved your Team ID and Registration Slip for venue verification.',
      tag: 'Important',
    },
  ],
};
