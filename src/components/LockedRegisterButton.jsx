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
        to="/register"
        onClick={onClick}
        className={`inline-flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer filter drop-shadow-sm hover:drop-shadow-md shrink-0 select-none ${className}`}
        title="Registrations are officially closed - Click for details"
      >
        <img
          src="/btn-register-locked.png"
          alt="Register - Closed"
          className="h-10 sm:h-11 xl:h-12 w-auto object-contain"
        />
      </Link>
    )
  }

  if (variant === 'nav-mobile') {
    return (
      <Link
        to="/register"
        onClick={onClick}
        className={`w-full flex items-center justify-center py-2 transition-transform duration-200 active:scale-95 select-none ${className}`}
        title="Registrations are officially closed"
      >
        <img
          src="/btn-register-locked.png"
          alt="Register - Closed"
          className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-sm"
        />
      </Link>
    )
  }

  if (variant === 'cta') {
    return (
      <Link
        to="/register"
        onClick={onClick}
        className={`inline-flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] select-none ${className}`}
        title="Registrations are officially closed - Click for details"
      >
        <img
          src="/btn-register-locked.png"
          alt="Register - Closed"
          className="h-18 sm:h-22 md:h-26 w-auto object-contain"
        />
      </Link>
    )
  }

  if (variant === 'contact') {
    return (
      <Link
        to="/register"
        onClick={onClick}
        className={`w-full flex items-center justify-center py-1 transition-all duration-200 hover:scale-102 active:scale-98 select-none ${className}`}
        title="Registrations are officially closed - View details"
      >
        <img
          src="/btn-register-locked.png"
          alt="Register - Closed"
          className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-md"
        />
      </Link>
    )
  }

  // Default: 'hero' variant
  // Proportioned to match EXPLORE AITHON width and height, with the padlock hanging naturally
  return (
    <Link
      to="/register"
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer filter drop-shadow-[0_6px_18px_rgba(6,43,89,0.28)] hover:drop-shadow-[0_10px_26px_rgba(6,43,89,0.4)] shrink-0 select-none ${className}`}
      title="Registrations are officially closed - Click for details"
    >
      <img
        src="/btn-register-locked.png"
        alt="Register - Registrations Closed"
        className="h-14 xs:h-16 sm:h-18 md:h-20 w-auto object-contain translate-y-1 sm:translate-y-1.5"
      />
    </Link>
  )
}
