import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  ExternalLink, 
  Calendar, 
  Trophy, 
  ArrowRight,
  Sparkles,
  MessageSquare
} from 'lucide-react'
import OrganizersModal from './OrganizersModal'

function InstagramIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  )
}

export default function ContactSection() {
  const [isOrganizersOpen, setIsOrganizersOpen] = useState(false)

  return (
    <>
      <section id="contact" className="w-full bg-white py-16 sm:py-20 lg:py-24 px-6 lg:px-8 border-t border-[#edebe6]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-bold text-[#ea580c] uppercase tracking-widest">
              CONNECT & INQUIRE
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062b59] tracking-tight">
              GET IN TOUCH
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
              Have questions regarding registration, problem statements, or sponsorship? 
              Reach out to our organizing committee or connect with our student coordinators.
            </p>
          </div>

          {/* Main Content Grid: Information Cards + Action Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left 7 Columns: 4 Contact Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Card 1: Venue & Campus */}
              <div className="bg-[#faf9f6] border border-[#edebe6] hover:border-[#e2d5c5] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f5ede4] border border-[#e2d5c5] flex items-center justify-center text-[#ea580c]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      HOST INSTITUTION
                    </span>
                    <h3 className="text-base font-bold text-[#062b59] mt-0.5">
                      Amrutvahini College of Engineering
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Dept. of Artificial Intelligence & Data Science<br />
                    Sangamner, Dist. Ahilyanagar (Ahmednagar), Maharashtra – 422608
                  </p>
                </div>

                <a
                  href="https://maps.google.com/?q=Amrutvahini+College+of+Engineering+Sangamner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#062b59] hover:text-[#ea580c] transition-colors pt-2 border-t border-[#edebe6] group"
                >
                  <span>Locate Campus on Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ea580c] transition-colors" />
                </a>
              </div>

              {/* Card 2: Student Coordinators */}
              <div className="bg-[#faf9f6] border border-[#edebe6] hover:border-[#e2d5c5] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f5ede4] border border-[#e2d5c5] flex items-center justify-center text-[#ea580c]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      DIRECT HELPLINE
                    </span>
                    <h3 className="text-base font-bold text-[#062b59] mt-0.5">
                      Student Coordinators
                    </h3>
                  </div>
                  
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Vedant Mande</span>
                      <a href="tel:+918591910018" className="font-bold text-[#062b59] hover:text-[#ea580c] transition-colors">
                        +91 85919 10018
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Sudhanshu Rahane</span>
                      <a href="tel:+917720092989" className="font-bold text-[#062b59] hover:text-[#ea580c] transition-colors">
                        +91 77200 92989
                      </a>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOrganizersOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#062b59] hover:text-[#ea580c] transition-colors pt-2 border-t border-[#edebe6] group cursor-pointer text-left"
                >
                  <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ea580c] transition-colors" />
                  <span>View All 7 Coordinators</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              </div>

              {/* Card 3: Email Inquiries */}
              <div className="bg-[#faf9f6] border border-[#edebe6] hover:border-[#e2d5c5] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f5ede4] border border-[#e2d5c5] flex items-center justify-center text-[#ea580c]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      EMAIL ASSISTANCE
                    </span>
                    <h3 className="text-base font-bold text-[#062b59] mt-0.5">
                      Official Desk
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    For sponsorship inquiries, college participation letters, or rulebook questions:
                  </p>
                  <a
                    href="mailto:aiesa.avcoe@gmail.com"
                    className="text-xs sm:text-sm font-bold text-[#062b59] hover:text-[#ea580c] transition-colors block truncate"
                  >
                    aiesa.avcoe@gmail.com
                  </a>
                </div>

                <a
                  href="mailto:aiesa.avcoe@gmail.com"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#062b59] hover:text-[#ea580c] transition-colors pt-2 border-t border-[#edebe6] group"
                >
                  <span>Write an Email</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </a>
              </div>

              {/* Card 4: Social & Community */}
              <div className="bg-[#faf9f6] border border-[#edebe6] hover:border-[#e2d5c5] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f5ede4] border border-[#e2d5c5] flex items-center justify-center text-[#ea580c]">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      COMMUNITY & MEDIA
                    </span>
                    <h3 className="text-base font-bold text-[#062b59] mt-0.5">
                      Instagram Updates
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Follow along for live event announcements, speaker highlights, and backstage moments.
                  </p>
                  <a
                    href="https://instagram.com/aiesa.avcoe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-bold text-[#ea580c] hover:underline block truncate"
                  >
                    @aiesa.avcoe
                  </a>
                </div>

                <a
                  href="https://instagram.com/aiesa.avcoe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#062b59] hover:text-[#ea580c] transition-colors pt-2 border-t border-[#edebe6] group"
                >
                  <span>Visit Instagram Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ea580c] transition-colors" />
                </a>
              </div>

            </div>

            {/* Right 5 Columns: High-Conversion Action Hub */}
            <div className="lg:col-span-5 bg-[#faf9f6] border border-[#e2d5c5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="space-y-2 pb-5 border-b border-[#edebe6]">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#062b59] bg-[#f5ede4] border border-[#e2d5c5]">
                  <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
                  AITHON 2.0 • NATIONAL HACKATHON
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#062b59] tracking-tight pt-1">
                  Ready to Showcase Your AI Innovation?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Join 400+ developers and tech innovators in a 12-hour high-impact offline hackathon.
                </p>
              </div>

              {/* Event Quick Snapshot */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#edebe6] flex items-center justify-center text-[#ea580c] shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#062b59]">09 October 2026</span>
                    <span className="text-slate-500 block text-xs">12 Hours Non-Stop Sprint</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#edebe6] flex items-center justify-center text-[#ea580c] shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#062b59]">₹1,00,000 Prize Pool</span>
                    <span className="text-slate-500 block text-xs">Awards, Trophies & Recognition</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#edebe6] flex items-center justify-center text-[#ea580c] shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#062b59]">2 to 4 Members / Team</span>
                    <span className="text-slate-500 block text-xs">Undergraduate & Diploma Engineers</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  to="/register"
                  className="w-full py-4 bg-[#062b59] hover:bg-[#1e3a8a] text-white font-bold text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md group"
                >
                  <span>REGISTER YOUR TEAM</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsOrganizersOpen(true)}
                  className="w-full py-3.5 bg-white hover:bg-[#f5ede4] border border-[#062b59] text-[#062b59] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <Users className="w-4 h-4 text-[#ea580c]" />
                  <span>CONTACT ORGANIZING COMMITTEE</span>
                </button>
              </div>

              {/* Guarantee / Helpline Footer Note */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center pt-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Need quick help? Call or WhatsApp our coordinators directly</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Organizers & SPOC Profiles Modal Card */}
      <OrganizersModal
        isOpen={isOrganizersOpen}
        onClose={() => setIsOrganizersOpen(false)}
      />
    </>
  )
}
