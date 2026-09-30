import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react'

export default function BackgroundMusic() {
  const location = useLocation()
  const audioRef = useRef(null)

  // Default audio volume set to 9% (0.09)
  const DEFAULT_VOLUME = 0.09
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [userHasPaused, setUserHasPaused] = useState(false)

  const isAdminRoute = location.pathname.startsWith('/admin')

  // Keep stable refs synchronized with state so persistent listeners always see latest values
  const volumeRef = useRef(volume)
  const isMutedRef = useRef(isMuted)
  const isAdminRouteRef = useRef(isAdminRoute)
  const userHasPausedRef = useRef(userHasPaused)

  useEffect(() => {
    volumeRef.current = volume
  }, [volume])

  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

  useEffect(() => {
    isAdminRouteRef.current = isAdminRoute
  }, [isAdminRoute])

  useEffect(() => {
    userHasPausedRef.current = userHasPaused
  }, [userHasPaused])

  // Clear any legacy paused flags from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('aithon_music_paused')
    } catch {
      // ignore
    }
  }, [])

  // Master function to start/resume audio playback unmuted
  const ensurePlayback = () => {
    const audio = audioRef.current
    if (!audio || isAdminRouteRef.current) return

    audio.muted = false
    audio.volume = isMutedRef.current ? 0 : volumeRef.current

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
          setIsMuted(false)
          setUserHasPaused(false)
        })
        .catch(() => {
          // If browser strictly requires user gesture for unmuted sound,
          // play muted first so audio buffer is ready and immediately active
          audio.muted = true
          audio.play()
            .then(() => {
              setIsPlaying(true)
            })
            .catch(() => {
              setIsPlaying(false)
            })
        })
    }
  }

  // 1. Automatically attempt to play on initial mount
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = true
    audio.volume = volume

    // Attempt automatic playback immediately
    ensurePlayback()
  }, [])

  // 2. Global interaction listener: ANY click, tap, touch, keydown anywhere on website turns song ON
  useEffect(() => {
    const handleGlobalInteraction = (e) => {
      if (isAdminRouteRef.current) return

      // If clicking inside the player controls widget itself, let widget buttons handle toggle
      if (e?.target?.closest?.('[data-music-player="true"]')) {
        return
      }

      const audio = audioRef.current
      if (!audio) return

      // If audio is paused or muted, ANY click anywhere on website immediately turns the song ON!
      if (audio.paused || audio.muted) {
        audio.muted = false
        audio.volume = volumeRef.current
        audio.play()
          .then(() => {
            setIsPlaying(true)
            setIsMuted(false)
            setUserHasPaused(false)
          })
          .catch(() => {})
      }
    }

    const INTERACTION_EVENTS = ['click', 'pointerdown', 'touchstart', 'keydown']
    const listenerOpts = { capture: true, passive: true }

    INTERACTION_EVENTS.forEach((evt) => {
      window.addEventListener(evt, handleGlobalInteraction, listenerOpts)
      document.addEventListener(evt, handleGlobalInteraction, listenerOpts)
    })

    return () => {
      INTERACTION_EVENTS.forEach((evt) => {
        window.removeEventListener(evt, handleGlobalInteraction, listenerOpts)
        document.removeEventListener(evt, handleGlobalInteraction, listenerOpts)
      })
    }
  }, [])

  // 3. React to route changes (silence in admin, play in public)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isAdminRoute) {
      audio.pause()
      setIsPlaying(false)
    } else {
      if (audio.paused) {
        audio.muted = false
        audio.volume = volumeRef.current
        audio.play().then(() => setIsPlaying(true)).catch(() => {})
      }
    }
  }, [location.pathname, isAdminRoute])

  // 4. Resume playback when returning to the tab (tab switch, mobile app focus, screen unlock)
  useEffect(() => {
    const handleResume = () => {
      const audio = audioRef.current
      if (!audio || isAdminRouteRef.current) return

      if (document.visibilityState === 'visible' && audio.paused) {
        audio.muted = false
        audio.volume = volumeRef.current
        audio.play().then(() => setIsPlaying(true)).catch(() => {})
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
  }, [])

  // 5. Sync volume & mute changes with audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume
    audio.muted = isMuted
  }, [volume, isMuted])

  const togglePlay = (e) => {
    e?.stopPropagation()
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      setUserHasPaused(true)
    } else {
      audio.muted = false
      audio.volume = volume
      setIsMuted(false)
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
      if (!nextMuted && audio.paused) {
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
        src="/alex-warren.mp3"
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
          if (audio && !isAdminRoute) {
            audio.currentTime = 0
            audio.play().catch(() => {})
          }
        }}
      >
        <source src="/alex-warren.mp3" type="audio/mpeg" />
        <source src="/Alex%20Warren%20-%20Ordinary%20(Karaoke%20Version).mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Ambient Music Tag - Right Hand Side (public routes only) */}
      {!isAdminRoute && (
        <aside
          data-music-player="true"
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

          {/* Main Tag */}
          <div className="inline-flex items-center gap-1.5 h-8 sm:h-9 bg-white/95 hover:bg-white backdrop-blur-md border border-[#edebe6] shadow-[0_4px_16px_rgba(6,43,89,0.10)] hover:shadow-[0_6px_20px_rgba(6,43,89,0.16)] rounded-full pl-1 pr-2 py-0.5 text-slate-700 transition-all duration-200">
            {/* Miniature Spinning Vinyl Record (24px - 28px) */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause Alex Warren background music' : 'Play Alex Warren background music'}
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
              title={isPlaying ? 'Alex Warren - Ordinary (Playing at 9%)' : 'Alex Warren - Ordinary (Paused)'}
            >
              <span className="text-[11px] font-bold text-[#062b59] tracking-tight whitespace-nowrap">
                Alex Warren
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
