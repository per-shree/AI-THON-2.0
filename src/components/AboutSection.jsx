import { useState, useEffect, useRef } from 'react'
import { RollingNumber } from '@kitlangton/rolling-number/react'

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    { label: 'NATIONAL LEVEL', text: 'COLLEGE AI HACKATHON' },
    { label: 'DURATION', num: 12, suffix: ' HOURS NON-STOP' },
    { label: 'FOCUS DOMAIN', text: 'ARTIFICIAL INTELLIGENCE' },
    { label: 'EXPECTED PARTICIPANTS', num: 400, suffix: '+ STUDENT HACKERS' },
  ]

  return (
    <section ref={sectionRef} className="w-full bg-[#f5ede4] py-16 lg:py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Editorial Two-Column Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#062b59] leading-tight tracking-tight">
              ABOUT AITHON 2.0
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-slate-600 text-lg leading-relaxed">
            <p className="font-medium text-[#062b59] text-xl">
              AITHON 2.0 is a national-level AI hackathon organized by the Department of Artificial Intelligence & Data Science, Amrutvahini College of Engineering, Sangamner.
            </p>
            <p className="text-slate-600">
              The event brings students, developers, innovators and technology enthusiasts together to build practical solutions using Artificial Intelligence and emerging technologies.
            </p>
            <p className="font-bold text-[#ea580c] uppercase tracking-wide text-sm pt-4">
              Innovation • Problem Solving • Collaboration • Artificial Intelligence
            </p>
          </div>

        </div>

        {/* Clean Editorial Stat Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-[#e2d5c5]">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1 text-center md:text-left">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {s.label}
              </span>
              <span className="block text-base sm:text-lg font-extrabold text-[#062b59]">
                {s.num !== undefined ? (
                  <>
                    <RollingNumber value={isVisible ? s.num : 0} duration={800} />
                    {s.suffix}
                  </>
                ) : (
                  s.text
                )}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
