import { useState } from 'react'
import { BookOpenIcon, ArrowRightIcon } from './Icons'

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      q: 'Who can participate?',
      a: 'AITHON 2.0 is open to all undergraduate and diploma engineering / technology students enrolled in any recognized institution.',
    },
    {
      q: 'What is the team size?',
      a: 'Teams must consist of 2 to 4 members. Interdisciplinary teams are encouraged.',
    },
    {
      q: 'Is AITHON open for everyone?',
      a: 'Yes, it is a national-level event open to all eligible students across India.',
    },
    {
      q: 'What is the duration?',
      a: 'The hackathon is a continuous 12-hour intensive development event.',
    },
    {
      q: 'Where will the hackathon be conducted?',
      a: 'The event will be conducted offline at the Amrutvahini College of Engineering (AVCOE), Sangamner campus.',
    },
    {
      q: 'How do I register?',
      a: 'You can register your team through the "REGISTER NOW" button on this website before the registration deadline.',
    },
    {
      q: 'What technologies can be used?',
      a: 'Participants are free to use any open-source frameworks, machine learning models, cloud infrastructure, or APIs.',
    },
    {
      q: 'What are the judging criteria?',
      a: 'Projects are evaluated on innovation, technical complexity, real-world applicability, and presentation quality.',
    }
  ]

  return (
    <section className="w-full bg-[#f5ede4] py-16 lg:py-24 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="text-center flex flex-col items-center justify-center space-y-3">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#062b59] tracking-tight text-center">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto text-center">
            Got questions about AITHON 2.0? Find quick answers below or explore the complete guidelines and terms.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index} className="border-b border-[#e2d5c5]">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-5 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
                >
                  <span className="text-lg font-bold text-[#062b59] group-hover:text-[#2563eb] transition-colors">
                    {faq.q}
                  </span>
                  <span className="text-[#2563eb] text-2xl font-normal ml-4">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-6 pr-12">
                    <p className="text-slate-600 text-base leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Rule Book Callout Banner */}
        <div className="rounded-2xl bg-white border border-[#edebe6] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#062b59]">
              Need complete participation details?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Read our full rule book covering eligibility, team formation, submission rules, and intellectual property.
            </p>
          </div>
          <a
            href="#guidelines"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#062b59] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-xs group"
          >
            <BookOpenIcon className="w-4 h-4" />
            <span>VIEW OFFICIAL RULE BOOK</span>
            <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  )
}
