import { Link } from 'react-router-dom'
import { IS_REGISTRATION_CLOSED } from '../config/registrationConfig'
import LockedRegisterButton from './LockedRegisterButton'

export default function RegistrationCta() {
  return (
    <section className="w-full bg-[#0f2b5c] text-white py-16 sm:py-20 lg:py-24 px-6 lg:px-8 border-b border-[#091e42] relative overflow-hidden">
      {/* Background ambient decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        
        <p className="text-xs font-bold text-blue-300 uppercase tracking-widest">
          NATIONAL LEVEL AI HACKATHON
        </p>

        {IS_REGISTRATION_CLOSED ? (
          <>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              REGISTRATIONS OFFICIALLY CLOSED
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              We have officially closed registrations after an overwhelming response across colleges. The evaluation panel is currently reviewing idea presentations.
            </p>

            <div className="pt-4 flex flex-col items-center justify-center gap-3">
              <LockedRegisterButton variant="cta" />
              <span className="text-xs text-blue-200 font-semibold mt-1">
                Click to view registered team guidelines & shortlisting updates
              </span>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              READY TO BUILD THE FUTURE?
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Bring your team, your ideas and your passion for technology to AITHON 2.0 at Amrutvahini College of Engineering, Sangamner.
            </p>

            <div className="pt-4">
              <Link
                to="/register"
                className="inline-block px-10 py-4 rounded-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-md"
              >
                REGISTER NOW
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  )
}
