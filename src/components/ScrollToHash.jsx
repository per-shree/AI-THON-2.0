import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      // If navigating to a page without a hash, scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    const targetId = hash.replace('#', '')

    const performScroll = () => {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return true
      }
      return false
    }

    // Try immediate scroll
    if (!performScroll()) {
      // Fallback polling for dynamically rendered components & images
      const t1 = setTimeout(performScroll, 80)
      const t2 = setTimeout(performScroll, 250)
      const t3 = setTimeout(performScroll, 600)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }
  }, [pathname, hash])

  return null
}
