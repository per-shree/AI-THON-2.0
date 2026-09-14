export default function GuidelinesSection() {
  const items = [
    {
      title: 'ELIGIBILITY & STREAMS',
      content: 'AITHON 2.0 is open to all Undergraduate (UG) and Diploma students enrolled in recognized institutions across India (Engineering, Medical/Healthcare, Pharmacy, Law, Management, Arts/Media, Design, Agriculture, and Polytechnic). Note: Postgraduate students (M.E./M.Tech/MBA/M.Sc), PhD scholars, and working professionals are strictly ineligible.',
    },
    {
      title: 'TEAM STRUCTURE (4–6 MEMBERS)',
      content: 'Teams must strictly comprise 4 to 6 members, including 1 designated Team Leader. Interdisciplinary and inter-departmental teams from different academic years and institutions are strongly welcomed and encouraged.',
    },
    {
      title: 'ROUND 1: REGISTRATION & PPT SUBMISSION',
      content: 'Teams must register on the portal, select 1 of the 23 competition tracks, and upload an Idea Presentation using the official AITHON PPT template (.pptx/.pdf, max 10MB). A nominal evaluation fee of ₹50 per team is required upon submission via Razorpay.',
    },
    {
      title: 'ROUND 2: SHORTLISTING & FINALE CONFIRMATION',
      content: 'An independent jury panel evaluates all Round 1 idea proposals. Shortlisted finalist teams receive an official Acceptance Email with their unique Team ID to confirm their on-campus workstation (Grand Finale fee: ₹200 per member).',
    },
    {
      title: '12-HOUR OFFLINE FINALE AT AVCOE',
      content: 'The Grand Finale will be conducted physically on-campus at Amrutvahini College of Engineering (AVCOE), Sangamner, featuring 12 hours of continuous offline hacking, development, and architectural mentoring.',
    },
    {
      title: 'PROTOTYPE & GITHUB REPOSITORY',
      content: 'During the finale, teams must build a functional software/hardware prototype, maintain an active public GitHub repository with regular commits, and prepare a presentation slide deck for the jury demonstration.',
    },
    {
      title: 'PERMISSIBLE TECHNOLOGIES & AI APIS',
      content: 'Participants are encouraged to leverage open-source frameworks, machine learning models, Generative AI APIs, cloud infrastructure, and hardware components. Pre-built proprietary commercial solutions or plagiarized code are strictly prohibited.',
    },
    {
      title: 'INTELLECTUAL PROPERTY & CODE OF CONDUCT',
      content: '100% of intellectual property rights and project ownership remain with the student creators. All participants must uphold professional ethical standards; any plagiarism or misconduct will lead to immediate team disqualification.',
    }
  ]

  return (
    <section id="guidelines" className="w-full bg-[#f5ede4] py-16 lg:py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#ea580c]">
              OFFICIAL RULES & TERMS
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#062b59] tracking-tight">
            GUIDELINES & ELIGIBILITY
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed">
            Official participation guidelines, team rules, and two-round evaluation criteria for AITHON 2.0.
          </p>
        </div>

        {/* Clean Numbered List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {items.map((item, index) => (
            <div key={item.title} className="flex flex-col space-y-2.5">
              <span className="text-[#ea580c] font-black text-lg sm:text-xl">
                0{index + 1}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#062b59] tracking-tight">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
                {item.content}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
