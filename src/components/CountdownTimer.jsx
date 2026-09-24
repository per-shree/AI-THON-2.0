import { useState, useEffect } from 'react'
import { RollingNumber } from '@kitlangton/rolling-number/react'

export default function CountdownTimer({ variant = 'default' }) {
  const calculateTimeLeft = () => {
    // Registration deadline: 04 October 2026 at 11:59:59 PM IST
    const targetDate = new Date('2026-10-04T23:59:59+05:30').getTime()
    const now = new Date().getTime()
    const difference = targetDate - now

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isExpired: false,
      }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft)

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft())
    }

    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ]

  if (variant === 'hero') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-1.5 xs:gap-2 sm:gap-3">
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className="bg-white/95 backdrop-blur-sm border border-[#edebe6] rounded-xl py-1.5 xs:py-2 sm:py-2.5 px-1.5 xs:px-2 sm:px-3 shadow-2xs flex flex-col items-center justify-center space-y-0.5 hover:border-[#2563eb]/40 transition-colors"
            >
              <span className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-black text-[#062b59] font-mono tabular-nums tracking-tight leading-none">
                <RollingNumber
                  value={unit.value}
                  format={{ minimumIntegerDigits: 2 }}
                  duration={450}
                />
              </span>
              <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-none mt-0.5 sm:mt-1">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-6 sm:py-10 w-full max-w-4xl mx-auto px-4">
      {/* Event Header Pill & Generous Spacing */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-12 space-y-3">
        <div className="inline-flex items-center px-5 py-2 rounded-full bg-white border border-[#e2d5c5] shadow-xs">
          <span className="text-sm sm:text-base font-extrabold text-[#062b59] uppercase tracking-wider">
            {timeLeft.isExpired ? 'REGISTRATIONS CLOSED' : 'REGISTRATIONS CLOSE IN'}
          </span>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 tracking-widest uppercase">
          DEADLINE: 04 OCTOBER 2026 (11:59 PM IST) • AITHON 2.0
        </p>
      </div>

      {/* Countdown Cards / Tabs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-3xl mx-auto">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="bg-white border border-[#edebe6] hover:border-[#ea580c]/50 rounded-2xl p-5 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center space-y-3 sm:space-y-4 group relative overflow-hidden"
          >
            {/* Top subtle accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ea580c] to-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Digit Display */}
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-black text-[#062b59] font-mono tabular-nums tracking-tight group-hover:text-[#ea580c] transition-colors">
              <RollingNumber
                value={unit.value}
                format={{ minimumIntegerDigits: 2 }}
                duration={450}
              />
            </span>

            {/* Formatted Badge Unit Label */}
            <span className="inline-block px-3 py-1 rounded-md bg-[#faf9f6] border border-[#edebe6] text-[11px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest group-hover:bg-[#f5ede4] group-hover:text-[#062b59] group-hover:border-[#e2d5c5] transition-colors">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
