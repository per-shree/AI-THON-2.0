import { Link } from 'react-router-dom'

/**
 * LockedRegisterButton
 * Renders full-size, authentic 3D locked button images matching the user reference
 * with zero clipping, full chain loops, and realistic gold padlock.
 */
export default function LockedRegisterButton({ 
  variant = 'hero', 
  className = '',
  onClick,
}) {
  if (variant === 'nav') {
    return (
      <Link
        to="/shortlisted-teams"
        onClick={onClick}
        className={`inline-flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer filter drop-shadow-sm hover:drop-shadow-md shrink-0 select-none ${className}`}
        title="View Grand Finale Shortlisted Teams"
      >
        <img
          src="/btn-register-locked.png"
          alt="See the Result"
          className="h-8 sm:h-8.5 xl:h-9 w-auto object-contain"
        />
      </Link>
    )
  }

  if (variant === 'nav-mobile') {
    return (
      <Link
        to="/shortlisted-teams"
        onClick={onClick}
        className={`w-full flex items-center justify-center py-2 transition-transform duration-200 active:scale-95 select-none ${className}`}
        title="View Grand Finale Shortlisted Teams"
      >
        <img
          src="/btn-register-locked.png"
          alt="See the Result"
          className="h-9 sm:h-10 w-auto object-contain filter drop-shadow-sm"
        />
      </Link>
    )
  }

  if (variant === 'cta') {
    return (
      <Link
        to="/shortlisted-teams"
        onClick={onClick}
        className={`inline-flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] select-none ${className}`}
        title="View Grand Finale Shortlisted Teams"
      >
        <img
          src="/btn-register-locked.png"
          alt="See the Result"
          className="h-12 sm:h-13 md:h-14 w-auto object-contain"
        />
      </Link>
    )
  }

  if (variant === 'contact') {
    return (
      <Link
        to="/shortlisted-teams"
        onClick={onClick}
        className={`w-full flex items-center justify-center py-1 transition-all duration-200 hover:scale-102 active:scale-98 select-none ${className}`}
        title="View Grand Finale Shortlisted Teams"
      >
        <img
          src="/btn-register-locked.png"
          alt="See the Result"
          className="h-11 sm:h-12 w-auto object-contain filter drop-shadow-md"
        />
      </Link>
    )
  }

  // Default: 'hero' variant
  // Proportioned to match EXPLORE AITHON height (h-11 to h-14) without offset
  return (
    <Link
      to="/shortlisted-teams"
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer filter drop-shadow-[0_6px_18px_rgba(6,43,89,0.28)] hover:drop-shadow-[0_10px_26px_rgba(6,43,89,0.4)] shrink-0 select-none ${className}`}
      title="View Grand Finale Shortlisted Teams"
    >
      <img
        src="/btn-register-locked.png"
        alt="See the Result"
        className="h-11 xs:h-12 sm:h-13 md:h-14 w-auto object-contain"
      />
    </Link>
  )
}
