import { useState, useEffect } from 'react'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date('2026-10-09T09:00:00+05:30').getTime()

    const updateTimer = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num) => String(num).padStart(2, '0')

  return (
    <div className="py-8">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-4">
        COUNTDOWN TO AITHON 2.0 • 09 OCTOBER 2026
      </p>

      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto text-center">
        <div className="bg-white border border-[#edebe6] p-4 rounded-xl shadow-xs">
          <span className="block text-3xl font-extrabold text-[#062b59]">{formatNumber(timeLeft.days)}</span>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">DAYS</span>
        </div>
        <div className="bg-white border border-[#edebe6] p-4 rounded-xl shadow-xs">
          <span className="block text-3xl font-extrabold text-[#062b59]">{formatNumber(timeLeft.hours)}</span>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">HOURS</span>
        </div>
        <div className="bg-white border border-[#edebe6] p-4 rounded-xl shadow-xs">
          <span className="block text-3xl font-extrabold text-[#062b59]">{formatNumber(timeLeft.minutes)}</span>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">MINUTES</span>
        </div>
        <div className="bg-white border border-[#edebe6] p-4 rounded-xl shadow-xs">
          <span className="block text-3xl font-extrabold text-[#062b59]">{formatNumber(timeLeft.seconds)}</span>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">SECONDS</span>
        </div>
      </div>
    </div>
  )
}
