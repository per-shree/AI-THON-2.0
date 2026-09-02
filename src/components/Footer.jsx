import { Link, useLocation } from 'react-router-dom'

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
        <div className="space-y-2 max-w-sm">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-white m-0">
              AITHON 2.0
            </h2>
            <span className="text-[#60a5fa] font-bold text-[11px] tracking-wider uppercase bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
              AI HACKATHON
            </span>
          </div>
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
                <a href="mailto:contact@aithon.com" className="hover:text-white transition-colors">
                  contact@aithon.com
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-5xl mx-auto pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
        <p>© 2026 AITHON 2.0. All Rights Reserved.</p>
        <Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
      </div>
    </footer>
  )
}
