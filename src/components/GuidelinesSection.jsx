export default function GuidelinesSection() {
  const items = [
    {
      title: 'ELIGIBILITY',
      content: 'AITHON 2.0 is open to all undergraduate and diploma engineering / technology students enrolled in any recognized institution across India.',
    },
    {
      title: 'TEAM FORMATION',
      content: 'Teams must consist of 2 to 4 members. Interdisciplinary teams from different departments are encouraged.',
    },
    {
      title: 'REGISTRATION',
      content: 'All team registrations must be submitted through the official online portal prior to the registration deadline.',
    },
    {
      title: 'SUBMISSION REQUIREMENTS',
      content: 'Teams must provide access to their working source code repository, a live working prototype demonstration, and presentation slides.',
    },
    {
      title: 'TECHNOLOGY USAGE',
      content: 'Participants are free to use open-source frameworks, machine learning models, Generative AI APIs, cloud infrastructure, and hardware components.',
    },
    {
      title: 'EVALUATION',
      content: 'Projects will be evaluated based on innovation, technical complexity, real-world applicability, and presentation quality.',
    },
    {
      title: 'CODE OF CONDUCT',
      content: 'All participants must maintain professional behavior. Any form of plagiarism or disruptive conduct will lead to immediate disqualification.',
    },
    {
      title: 'INTELLECTUAL PROPERTY',
      content: 'All rights and ownership of intellectual property created during AITHON 2.0 remain 100% with the respective student team.',
    }
  ]

  return (
    <section className="w-full bg-[#f5ede4] py-16 lg:py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#062b59] tracking-tight">
            GUIDELINES
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl">
            General rules and terms governing participation in AITHON 2.0.
          </p>
        </div>

        {/* Clean Numbered List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {items.map((item, index) => (
            <div key={item.title} className="flex flex-col space-y-2">
              <span className="text-[#ea580c] font-bold text-lg">
                0{index + 1}
              </span>
              <h3 className="text-xl font-bold text-[#062b59] tracking-tight">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-base">
                {item.content}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
