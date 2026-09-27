import { useEffect, useRef, useState } from 'react'

/**
 * ScrollReveal Component
 * Provides soft, fluid, hardware-accelerated scroll-triggered entrance animations.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade'} [props.animation='fade-up']
 * @param {number} [props.delay=0] - Delay in milliseconds
 * @param {number} [props.duration=800] - Duration in milliseconds
 * @param {string} [props.distance='22px'] - Translate distance
 * @param {number} [props.threshold=0.08] - Intersection threshold
 * @param {string} [props.rootMargin='0px 0px -40px 0px']
 * @param {string} [props.className='']
 * @param {string} [props.as='div']
 * @param {string} [props.id]
 * @param {React.CSSProperties} [props.style]
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  distance = '22px',
  threshold = 0.08,
  rootMargin = '0px 0px -40px 0px',
  className = '',
  as: Component = 'div',
  id,
  style = {},
  ...rest
}) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    // If running in an unsupported environment, reveal immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    // Respect reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (elementRef.current) {
            observer.unobserve(elementRef.current)
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    const currentElem = elementRef.current
    if (currentElem) {
      observer.observe(currentElem)
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem)
      }
    }
  }, [threshold, rootMargin])

  // Determine starting transform based on animation type
  let hiddenTransform = 'none'
  switch (animation) {
    case 'fade-up':
      hiddenTransform = `translate3d(0, ${distance}, 0)`
      break
    case 'fade-down':
      hiddenTransform = `translate3d(0, -${distance}, 0)`
      break
    case 'fade-left':
      hiddenTransform = `translate3d(-${distance}, 0, 0)`
      break
    case 'fade-right':
      hiddenTransform = `translate3d(${distance}, 0, 0)`
      break
    case 'scale':
      hiddenTransform = 'scale3d(0.96, 0.96, 1)'
      break
    case 'fade':
    default:
      hiddenTransform = 'none'
      break
  }

  const revealStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'none' : hiddenTransform,
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
    ...style,
  }

  return (
    <Component
      ref={elementRef}
      id={id}
      className={`scroll-reveal ${isVisible ? 'is-revealed' : 'is-pending'} ${className}`}
      style={revealStyle}
      {...rest}
    >
      {children}
    </Component>
  )
}
