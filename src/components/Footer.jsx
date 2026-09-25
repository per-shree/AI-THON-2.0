import { Link, useLocation } from 'react-router-dom'
import aithonHeroLogo from '../assets/aithon-hero-logo.png'

export default function Footer() {
  const location = useLocation()
  const getHref = (hash) => (location.pathname === '/' ? hash : `/${hash}`)

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
    <footer className="w-full bg-[#062b59] text-white py-8 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 border-b border-[#1e3a8a]/70 pb-6">
        
        {/* Brand Info */}
        <div className="space-y-3 max-w-sm">
          <Link to="/" className="inline-block group focus:outline-hidden" aria-label="AITHON 2.0 Home">
            <img
              src={aithonHeroLogo}
              alt="AITHON 2.0"
              className="h-8 sm:h-9 w-auto object-contain brightness-0 invert select-none opacity-95 group-hover:opacity-100 transition-opacity"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="sr-only">AITHON 2.0</span>
          </Link>
          <p className="text-slate-300 text-xs leading-relaxed">
            Department of Artificial Intelligence & Data Science<br/>
            Amrutvahini College of Engineering, Sangamner
          </p>
        </div>

        {/* Navigation Grid (Compact 2-Column) */}
        <div className="flex flex-col sm:flex-row gap-8 lg:gap-14">
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Navigation</h3>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs text-slate-300 font-medium">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={getHref(link.href)} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Connect</h3>
            <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
              <li>
                <a href="https://instagram.com/aiesa.avcoe" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Instagram: @aiesa.avcoe</span>
                </a>
              </li>
              <li>
                <a href="mailto:ai.veer2k26@gmail.com" className="hover:text-white transition-colors">
                  ai.veer2k26@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-5xl mx-auto pt-4 text-center text-xs text-slate-400">
        <p>© 2026 AITHON 2.0. All Rights Reserved.</p>
      </div>
    </footer>
  )
}
