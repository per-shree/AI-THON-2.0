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
    <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#edebe6] py-3.5' : 'bg-white py-4 sm:py-5 border-b border-[#edebe6]'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <Link to="/" className="text-2xl font-extrabold text-[#062b59] tracking-tight">
              AITHON<span className="text-[#2563eb]">2.0</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.label}
                  href={getHref(link.href)}
                  className="text-sm font-bold text-slate-600 hover:text-[#2563eb] transition-colors uppercase tracking-wider"
                >
                  {link.label}
                </a>
              ))}
            </div>
            
            <Link 
              to="/register"
              className="px-6 py-2.5 bg-[#062b59] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2563eb] transition-colors rounded-lg shadow-xs"
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
