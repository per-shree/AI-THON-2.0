import { useState, useEffect, useRef } from 'react'
import { RollingNumber, RollingText } from '@kitlangton/rolling-number/react'

export default function PrizesSection() {
  const [isActive, setIsActive] = useState(false)
  const headingRef = useRef(null)

  useEffect(() => {
    let timer = null

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Delay briefly after user scrolls into view so the animation starts right before their eyes
          timer = setTimeout(() => {
            setIsActive(true)
          }, 200)
        } else {
          clearTimeout(timer)
          setIsActive(false)
        }
      },
      {
        threshold: 0.5,
      }
    )

    if (headingRef.current) {
      observer.observe(headingRef.current)
    }

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  const prizes = [
    { title: '1st Prize', note: 'Winner Champion Trophy & Award', status: 'Coming Soon' },
    { title: '2nd Prize', note: 'Runner Up Trophy & Award', status: 'Coming Soon' },
    { title: '3rd Prize', note: 'Second Runner Up Award', status: 'Coming Soon' },
    { title: 'Special Awards', note: 'Domain Innovation & Category Awards', status: 'Coming Soon' },
  ]

  return (
    <section id="prizes" className="w-full bg-[#f5ede4] py-20 lg:py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Large Typography Prize Header */}
        <div ref={headingRef} className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs font-bold text-[#ea580c] uppercase tracking-widest">
            REWARDS & RECOGNITION
          </p>

          <h2 className="text-5xl sm:text-7xl font-black text-[#062b59] tracking-tight inline-flex items-baseline justify-center">
            <RollingText
              text={isActive ? "₹" : " "}
              transition="direct"
              duration={1200}
              pauseOffscreen={false}
            />
            <RollingNumber
              value={isActive ? 100000 : 0}
              locales="en-IN"
              duration={1200}
              pauseOffscreen={false}
            />
          </h2>
          <p className="text-lg sm:text-xl font-bold text-slate-500 uppercase tracking-widest">
            TOTAL PRIZE POOL
          </p>

          <p className="text-xs text-slate-400 font-medium">
            Prize Pool Subject to Change
          </p>
        </div>

        {/* 4 Simple Award Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {prizes.map((p) => (
            <div key={p.title} className="bg-white border border-[#edebe6] rounded-xl p-6 text-center space-y-2 shadow-xs hover:border-[#2563eb] transition-colors">
              <span className="text-xs font-bold text-[#2563eb] block uppercase">{p.title}</span>
              <p className="text-xs text-slate-500 font-medium">{p.note}</p>
              <span className="inline-block text-[11px] font-bold text-slate-600 bg-[#faf9f6] px-3 py-1 rounded border border-[#edebe6] mt-2">
                {p.status}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
