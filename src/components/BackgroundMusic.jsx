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
  const [userHasPaused, setUserHasPaused] = useState(() => {
    return localStorage.getItem('aithon_music_paused') === 'true'
  })

  const isAdminRoute = location.pathname.startsWith('/admin')

  // Set initial audio properties and attempt playback
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    audio.loop = true

    // If on admin route or user explicitly paused, don't autoplay
    if (isAdminRoute || userHasPaused) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    let started = false

    const attemptPlay = () => {
      if (started) return
      audio.play()
        .then(() => {
          started = true
          setIsPlaying(true)
          cleanupListeners()
        })
        .catch(() => {
          // Autoplay blocked by browser policy until first user interaction
          setIsPlaying(false)
        })
    }

    const onUserInteraction = () => {
      attemptPlay()
    }

    const cleanupListeners = () => {
      window.removeEventListener('click', onUserInteraction)
      window.removeEventListener('keydown', onUserInteraction)
      window.removeEventListener('touchstart', onUserInteraction)
      window.removeEventListener('scroll', onUserInteraction)
    }

    // Try direct play
    attemptPlay()

    // Attach listeners for first interaction if blocked
    window.addEventListener('click', onUserInteraction, { once: true, passive: true })
    window.addEventListener('keydown', onUserInteraction, { once: true, passive: true })
    window.addEventListener('touchstart', onUserInteraction, { once: true, passive: true })
    window.addEventListener('scroll', onUserInteraction, { once: true, passive: true })

    return () => {
      cleanupListeners()
    }
  }, [isAdminRoute, userHasPaused])

  // React to route changes (silence in admin, resume in public)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isAdminRoute) {
      audio.pause()
      setIsPlaying(false)
    } else if (!userHasPaused) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }, [location.pathname, isAdminRoute, userHasPaused])

  // Sync volume & mute changes with audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      setUserHasPaused(true)
      localStorage.setItem('aithon_music_paused', 'true')
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true)
          setUserHasPaused(false)
          localStorage.removeItem('aithon_music_paused')
        })
        .catch(console.error)
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    if (nextMuted && !isPlaying) {
      // remain paused
    } else if (!nextMuted && !isPlaying && !userHasPaused) {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(console.error)
    }
  }

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value)
    setVolume(newVol)
    if (newVol > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  // Do not render UI on admin routes
  if (isAdminRoute) {
    return (
      <audio
        ref={audioRef}
        loop
        preload="auto"
        playsInline
      >
        <source src="/journey.mp3" type="audio/mpeg" />
        <source src="/Tim%20Schaufert%20-%20Journey.mp3" type="audio/mpeg" />
      </audio>
    )
  }

  return (
    <>
      {/* Hidden HTML5 Audio Element in infinite loop */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/journey.mp3" type="audio/mpeg" />
        <source src="/Tim%20Schaufert%20-%20Journey.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Very Small Ambient Music Tag - Right Hand Side */}
      <aside
        aria-label="Background audio player"
        className="no-print fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 transition-all duration-300 select-none flex flex-col items-end"
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
    </>
  )
}
