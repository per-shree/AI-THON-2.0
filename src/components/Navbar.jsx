import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const getHref = (hash) => {
    return location.pathname === '/' ? hash : `/${hash}`
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Problem Statement', href: '#problem-statement' },
    { label: 'Guidelines', href: '#guidelines' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Prizes', href: '#prizes' },
    { label: 'Sponsors', href: '#sponsors' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#edebe6] py-2 sm:py-2.5' : 'bg-white py-2.5 sm:py-3 border-b border-[#edebe6]'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Brand Logos */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-3 sm:gap-4 group focus:outline-none py-0.5 shrink-0">
              <img
                src="/amrutvahini_logo.png"
                alt="Amrutvahini College of Engineering"
                className="h-14 sm:h-16 md:h-20 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="h-10 sm:h-12 w-px bg-slate-200 hidden sm:block shrink-0" />
              <img
                src="/aiesa_logo.png"
                alt="AIESA"
                className="h-9 sm:h-10 md:h-11 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
            <div className="flex items-center gap-3 xl:gap-4.5">
              {navLinks.map((link) => (
                <a 
                  key={link.label}
                  href={getHref(link.href)}
                  className="text-xs xl:text-sm font-bold text-slate-700 hover:text-[#2563eb] transition-colors uppercase tracking-wider whitespace-nowrap py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <Link 
              to="/register"
              className="px-5 py-2.5 bg-[#062b59] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-lg shadow-xs shrink-0 whitespace-nowrap"
            >
              REGISTER
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-[#062b59]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-[#edebe6] shadow-lg py-4 px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={getHref(link.href)}
              className="text-sm font-bold text-slate-700 uppercase tracking-wider py-2 border-b border-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link 
            to="/register"
            className="w-full mt-2 px-6 py-3 bg-[#062b59] text-white text-center text-xs font-bold uppercase tracking-widest rounded-lg shadow-xs"
            onClick={() => setMobileMenuOpen(false)}
          >
            REGISTER
          </Link>
        </div>
      )}
    </nav>
  )
}
