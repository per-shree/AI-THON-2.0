import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react'

export default function BackgroundMusic() {
  const location = useLocation()
  const audioRef = useRef(null)

  // Default audio volume set to 9% (0.09) as requested
  const DEFAULT_VOLUME = 0.09
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [userHasPaused, setUserHasPaused] = useState(false)

  const isAdminRoute = location.pathname.startsWith('/admin')

  // Clear any legacy paused flags from localStorage so music is always ON by default on enter/refresh
  useEffect(() => {
    try {
      localStorage.removeItem('aithon_music_paused')
    } catch {
      // ignore
    }
  }, [])

  // Set initial audio properties and attempt playback across all devices and views
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume
    audio.loop = true

    // If on admin route or user explicitly paused in this session, don't play
    if (isAdminRoute || userHasPaused) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    let isCallingPlay = false
    const timeouts = []

    // Actively try to turn on unmuted sound if browser permits
    const attemptUnmuteNow = () => {
      if (userHasPaused || isAdminRoute) return
      const currentAudio = audioRef.current
      if (!currentAudio) return

      try {
        currentAudio.muted = false
        currentAudio.volume = volume

        // If the browser paused playback due to unmuting without gesture, recover muted playback immediately
        if (currentAudio.paused) {
          currentAudio.muted = true
          currentAudio.play().catch(() => {})
        } else {
          // Succeeded! Music is ON and playing with sound
          setIsPlaying(true)
          setIsMuted(false)
          removeInteractionListeners()
        }
      } catch {
        currentAudio.muted = true
        currentAudio.play().catch(() => {})
      }
    }

    // Attempt to start audio; tries unmuted first, then muted fallback (which all mobile browsers allow)
    const startPlayback = () => {
      if (userHasPaused || isAdminRoute) return
      const currentAudio = audioRef.current
      if (!currentAudio || isCallingPlay) return

      isCallingPlay = true

      // Try 1: Unmuted playback (works immediately on desktop / browsers with permissions)
      currentAudio.muted = isMuted
      currentAudio.volume = isMuted ? 0 : volume

      const playPromise = currentAudio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isCallingPlay = false
            setIsPlaying(true)
            removeInteractionListeners()
          })
          .catch(() => {
            // Try 2: If unmuted was blocked by mobile browser autoplay policy,
            // start playing muted immediately (universally allowed by iOS Safari & Android Chrome)
            currentAudio.muted = true
            currentAudio
              .play()
              .then(() => {
                isCallingPlay = false
                setIsPlaying(true)

                // Try 3: Actively attempt to unmute now and after micro-delays (e.g. if transient activation exists from link/QR click)
                attemptUnmuteNow()
                timeouts.push(setTimeout(attemptUnmuteNow, 150))
                timeouts.push(setTimeout(attemptUnmuteNow, 400))
              })
              .catch(() => {
                isCallingPlay = false
                setIsPlaying(false)
              })
          })
      } else {
        isCallingPlay = false
      }
    }

    // On any user interaction (touch, tap, click, key, scroll), immediately unmute and ensure playback
    const unlockAndPlay = () => {
      if (userHasPaused || isAdminRoute) return
      const currentAudio = audioRef.current
      if (!currentAudio) return

      // Unmute to requested volume
      currentAudio.muted = false
      currentAudio.volume = volume

      // Explicitly invoke play() inside the user gesture call stack to authorize unmuted playback in iOS Safari & Android Chrome
      const p = currentAudio.play()
      if (p !== undefined) {
        p.then(() => {
          setIsPlaying(true)
          setIsMuted(false)
          removeInteractionListeners()
        }).catch(() => {
          // If this gesture was not yet accepted (e.g. touchstart on iOS), keep listeners active so touchend/click succeeds
        })
      } else {
        setIsPlaying(true)
        setIsMuted(false)
        removeInteractionListeners()
      }
    }

    // All possible user interaction events across mobile, tablet, and desktop
    const INTERACTION_EVENTS = [
      'pointerdown',
      'touchstart',
      'touchend',
      'pointerup',
      'click',
      'keydown',
      'scroll',
    ]

    const listenerOpts = { capture: true, passive: true }

    const addInteractionListeners = () => {
      INTERACTION_EVENTS.forEach((evt) => {
        window.addEventListener(evt, unlockAndPlay, listenerOpts)
        document.addEventListener(evt, unlockAndPlay, listenerOpts)
      })
    }

    const removeInteractionListeners = () => {
      timeouts.forEach(clearTimeout)
      INTERACTION_EVENTS.forEach((evt) => {
        window.removeEventListener(evt, unlockAndPlay, listenerOpts)
        document.removeEventListener(evt, unlockAndPlay, listenerOpts)
      })
    }

    // 1. Immediately attempt playback on mount
    startPlayback()

    // 2. Attach listeners to guarantee audio unmuting / playback on first gesture
    addInteractionListeners()

    return () => {
      removeInteractionListeners()
    }
  }, [isAdminRoute, userHasPaused, isMuted, volume])

  // React to route changes (silence in admin, resume in public)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isAdminRoute) {
      audio.pause()
      setIsPlaying(false)
    } else if (!userHasPaused) {
      if (audio.paused) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Will resume on interaction
          })
      } else {
        setIsPlaying(true)
      }
    }
  }, [location.pathname, isAdminRoute, userHasPaused])

  // Resume playback when returning to the tab on mobile devices (e.g. app switch, screen unlock, back navigation)
  useEffect(() => {
    const handleResume = () => {
      const audio = audioRef.current
      if (!audio || isAdminRoute || userHasPaused) return

      if (document.visibilityState === 'visible' && audio.paused) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {})
      }
    }

    document.addEventListener('visibilitychange', handleResume)
    window.addEventListener('focus', handleResume)
    window.addEventListener('pageshow', handleResume)

    return () => {
      document.removeEventListener('visibilitychange', handleResume)
      window.removeEventListener('focus', handleResume)
      window.removeEventListener('pageshow', handleResume)
    }
  }, [isAdminRoute, userHasPaused])

  // Sync volume & mute changes with audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume
    audio.muted = isMuted
  }, [volume, isMuted])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      setUserHasPaused(true)
    } else {
      audio.muted = isMuted
      audio.volume = isMuted ? 0 : volume
      audio.play()
        .then(() => {
          setIsPlaying(true)
          setUserHasPaused(false)
        })
        .catch(console.error)
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    const audio = audioRef.current
    if (audio) {
      audio.muted = nextMuted
      audio.volume = nextMuted ? 0 : volume
      if (!nextMuted && !isPlaying && !userHasPaused) {
        audio.play().then(() => setIsPlaying(true)).catch(console.error)
      }
    }
  }

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value)
    setVolume(newVol)
    const audio = audioRef.current
    if (audio) {
      audio.volume = newVol
      if (newVol > 0 && isMuted) {
        setIsMuted(false)
        audio.muted = false
      }
    }
  }

  return (
    <>
      {/* Persistent HTML5 Audio Element in infinite loop */}
      <audio
        ref={audioRef}
        src="/journey.mp3"
        loop
        autoPlay
        preload="auto"
        playsInline
        webkit-playsinline="true"
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          if (audioRef.current?.paused) {
            setIsPlaying(false)
          }
        }}
        onEnded={() => {
          const audio = audioRef.current
          if (audio && !isAdminRoute && !userHasPaused) {
            audio.currentTime = 0
            audio.play().catch(() => {})
          }
        }}
      >
        <source src="/journey.mp3" type="audio/mpeg" />
        <source src="/Tim%20Schaufert%20-%20Journey.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Very Small Ambient Music Tag - Right Hand Side (public routes only) */}
      {!isAdminRoute && (
        <aside
          aria-label="Background audio player"
          className="no-print fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 transition-all duration-300 select-none flex flex-col items-end"
        >
        {/* Optional Micro Popover for Volume Adjustment */}
        {isExpanded && (
          <div className="mb-2 p-2.5 w-48 bg-white/95 hover:bg-white backdrop-blur-md border border-[#edebe6] shadow-[0_8px_25px_rgba(6,43,89,0.12)] rounded-xl animate-fadeIn flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span className="text-[#062b59]">Volume</span>
              <span className="font-mono text-[#062b59] font-bold text-xs bg-slate-100 px-1 py-0.2 rounded">
                {Math.round(volume * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <VolumeX size={12} className="text-slate-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="0.30"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Background music volume"
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#062b59]"
              />
              <Volume2 size={12} className="text-[#062b59] shrink-0" />
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5">
              <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Infinite Loop
              </span>
              <button
                type="button"
                onClick={() => {
                  setVolume(DEFAULT_VOLUME)
                  setIsMuted(false)
                }}
                className="font-bold text-[#2563eb] hover:text-[#062b59] hover:underline transition-colors cursor-pointer"
              >
                Reset (9%)
              </button>
            </div>
          </div>
        )}

        {/* Very Small Main Tag (Height ~32-36px, compact and unobtrusive) */}
        <div className="inline-flex items-center gap-1.5 h-8 sm:h-9 bg-white/95 hover:bg-white backdrop-blur-md border border-[#edebe6] shadow-[0_4px_16px_rgba(6,43,89,0.10)] hover:shadow-[0_6px_20px_rgba(6,43,89,0.16)] rounded-full pl-1 pr-2 py-0.5 text-slate-700 transition-all duration-200">
          {/* Miniature Spinning Vinyl Record (24px - 28px) */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause Journey background music' : 'Play Journey background music'}
            title={isPlaying ? 'Click to Pause' : 'Click to Play'}
            className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 cursor-pointer shadow-2xs group focus:outline-none"
          >
            <div
              className="w-full h-full rounded-full overflow-hidden animate-vinyl"
              style={{
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <img
                src="/vinyl-record.png"
                alt="Vinyl"
                className="w-full h-full object-cover scale-[1.18] rounded-full pointer-events-none select-none"
              />
            </div>

            {/* Subtle play/pause indicator on hover / paused */}
            <div
              className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-150 ${
                isPlaying
                  ? 'bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100'
                  : 'bg-black/30 opacity-100'
              }`}
            >
              {isPlaying ? (
                <Pause size={9} className="text-white drop-shadow-xs" />
              ) : (
                <Play size={9} className="text-white translate-x-0.2 drop-shadow-xs" />
              )}
            </div>
          </button>

          {/* Micro Track Title & Volume Badge */}
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-1 cursor-pointer text-left focus:outline-none"
            title={isPlaying ? 'Journey (Playing at 9%)' : 'Journey (Paused)'}
          >
            <span className="text-[11px] font-bold text-[#062b59] tracking-tight whitespace-nowrap">
              Journey
            </span>
            <span className="text-[8.5px] font-extrabold text-[#2563eb] bg-blue-50 px-1 py-0.2 rounded-full border border-blue-200/60 leading-none">
              {isMuted ? 'Mute' : `${Math.round(volume * 100)}%`}
            </span>
          </button>

          {/* Quick Mute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="p-1 text-slate-400 hover:text-[#062b59] transition-colors rounded-full cursor-pointer shrink-0"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={13} className="text-rose-500" />
            ) : (
              <Volume2 size={13} />
            )}
          </button>

          {/* Tiny Chevron for optional volume slider popover */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Hide volume slider' : 'Show volume slider'}
            title={isExpanded ? 'Close' : 'Adjust volume'}
            className="text-slate-400 hover:text-[#062b59] p-0.5 rounded-full transition-colors cursor-pointer shrink-0"
          >
            {isExpanded ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
          </button>
        </div>
      </aside>
      )}
    </>
  )
}
