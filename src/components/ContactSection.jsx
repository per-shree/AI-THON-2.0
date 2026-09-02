import { Link } from 'react-router-dom'

export default function ContactSection() {
  return (
    <section className="w-full bg-white py-16 lg:py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 justify-between items-start">
        
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#062b59] tracking-tight">
              GET IN TOUCH
            </h2>
            <p className="text-slate-600 text-lg max-w-md leading-relaxed">
              Have questions about AITHON 2.0? Reach out to our organizing committee or connect with us on social media.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#062b59]">AITHON 2.0</h3>
              <p className="text-slate-600 leading-relaxed text-base">
                Department of Artificial Intelligence & Data Science<br/>
                Amrutvahini College of Engineering<br/>
                Sangamner, Maharashtra
              </p>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                SOCIAL
              </h3>
              <a 
                href="https://instagram.com/aiesa.avcoe" 
                target="_blank" 
                rel="noreferrer"
                className="text-lg font-bold text-[#2563eb] hover:text-[#062b59] transition-colors"
              >
                Instagram: @aiesa.avcoe
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto min-w-[200px]">
          <a
            href="mailto:contact@aithon.com"
            className="w-full px-8 py-4 bg-[#faf9f6] hover:bg-white border-2 border-[#062b59] text-[#062b59] font-bold text-sm uppercase tracking-wider text-center transition-colors rounded-lg shadow-xs"
          >
            CONTACT US
          </a>
          <Link
            to="/register"
            className="w-full px-8 py-4 bg-[#062b59] border-2 border-[#062b59] text-white font-bold text-sm uppercase tracking-wider text-center hover:bg-[#2563eb] hover:border-[#2563eb] transition-colors shadow-sm rounded-lg"
          >
            REGISTER NOW
          </Link>
        </div>

      </div>
    </section>
  )
}
