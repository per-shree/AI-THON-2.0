import { useState } from 'react'

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
        
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#062b59] tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index} className="border-b border-[#e2d5c5]">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
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

      </div>
    </section>
  )
}
