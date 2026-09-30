import { useState, useEffect, useRef } from 'react'
import { RollingNumber, RollingText } from '@kitlangton/rolling-number/react'

export default function PrizesSection() {
  const [isActive, setIsActive] = useState(false)
  const [mainPrizeValue, setMainPrizeValue] = useState(0)
  const [isCutVisible, setIsCutVisible] = useState(false)
  const [isUpgraded, setIsUpgraded] = useState(false)
  const sectionRef = useRef(null)
  const timerRefs = useRef([])

  const clearAllTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t))
    timerRefs.current = []
  }

  const runAnimation = () => {
    clearAllTimers()

    // Phase 1: Start counter and roll to 1,00,000
    setIsActive(true)
    setMainPrizeValue(100000)
    setIsCutVisible(false)
    setIsUpgraded(false)

    // Phase 2: Apply the cut line slash effect on 1,00,000 after it settles
    const cutTimer = setTimeout(() => {
      setIsCutVisible(true)

      // Phase 3: Slashed line dissolves and numbers roll into 2,40,000 on the same place
      const upgradeTimer = setTimeout(() => {
        setIsCutVisible(false)
        setIsUpgraded(true)
        setMainPrizeValue(240000)
      }, 900)

      timerRefs.current.push(upgradeTimer)
    }, 1300)

    timerRefs.current.push(cutTimer)
  }

  const resetAnimation = () => {
    clearAllTimers()
    setIsActive(false)
    setMainPrizeValue(0)
    setIsCutVisible(false)
    setIsUpgraded(false)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation()
        } else {
          resetAnimation()
        }
      },
      {
        threshold: 0.1,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    const handleHashChange = () => {
      if (window.location.hash === '#prizes') {
        runAnimation()
      }
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      clearAllTimers()
      observer.disconnect()
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const prizes = [
    {
      title: '1st Prize',
      amount: 40000,
      note: '+ 3-Month Internship for Winners worth ₹1.20L + Trophies',
    },
    {
      title: '2nd Prize',
      amount: 30000,
      note: 'Runner Up Award',
    },
    {
      title: '3rd Prize',
      amount: 20000,
      note: 'Second Runner Up Award',
    },
    {
      title: '4th Prize',
      amount: 6000,
      note: 'Consolation Award',
    },
    {
      title: '5th Prize',
      amount: 4000,
      note: 'Consolation Award',
    },
    {
      title: 'Top 20',
      isText: true,
      text: 'Surprise Gifts',
      note: 'Surprise Gifts for Top 20 Teams',
    },
  ]

  return (
    <section ref={sectionRef} id="prizes" className="w-full bg-[#f5ede4] py-20 lg:py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-14">
        
        {/* Large Typography Prize Header with Cut & Form Effect */}
        <div className="text-center max-w-3xl mx-auto space-y-3 flex flex-col items-center justify-center">
          <p className="text-xs font-semibold text-[#ea580c] uppercase tracking-widest text-center">
            REWARDS & RECOGNITION
          </p>

          <div className="flex items-center justify-center w-full relative">
            <h2
              onClick={runAnimation}
              className="text-5xl sm:text-6xl font-bold text-[#062b59] tracking-tight flex items-center justify-center text-center relative select-none cursor-pointer"
              title="Click to replay prize pool reveal"
            >
              <RollingText
                text={isActive ? "₹" : " "}
                transition="direct"
                duration={1000}
                pauseOffscreen={false}
              />
              <RollingNumber
                value={mainPrizeValue}
                locales="en-IN"
                duration={isUpgraded ? 1100 : 900}
                pauseOffscreen={false}
              />

              {/* Straight Horizontal Red Cut Line across 1,00,000 (as shown in image) */}
              <span
                className={`absolute -left-3 sm:-left-4 -right-3 sm:-right-4 top-1/2 -translate-y-1/2 h-[3.5px] sm:h-[4px] bg-[#dc2626] rounded-xs pointer-events-none origin-left transition-all duration-300 ease-out z-10 ${
                  isCutVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`}
                style={{
                  transformOrigin: 'left center',
                }}
              />
            </h2>
          </div>
          
          <p className="text-base sm:text-lg font-semibold text-slate-500 uppercase tracking-widest text-center">
            TOTAL PRIZE POOL
          </p>
        </div>

        {/* 6 Clean Award Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prizes.map((p) => (
            <div
              key={p.title}
              className="bg-white border border-[#edebe6] rounded-xl p-6 text-center space-y-2 shadow-xs hover:border-[#2563eb] transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#2563eb] block uppercase tracking-wider text-center">
                  {p.title}
                </span>

                <div className="py-1">
                  {p.amount ? (
                    <div className="text-3xl sm:text-4xl font-bold text-[#062b59] tracking-tight flex items-center justify-center text-center">
                      <RollingText
                        text={isActive ? "₹" : " "}
                        transition="direct"
                        duration={1200}
                        pauseOffscreen={false}
                      />
                      <RollingNumber
                        value={isActive ? p.amount : 0}
                        locales="en-IN"
                        duration={1200}
                        pauseOffscreen={false}
                      />
                    </div>
                  ) : (
                    <div className="text-2xl sm:text-3xl font-bold text-[#062b59] tracking-tight flex items-center justify-center text-center min-h-[40px]">
                      {p.text}
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {p.note}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
