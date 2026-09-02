export default function ProblemStatements() {
  const domains = [
    'Artificial Intelligence',
    'Machine Learning',
    'Generative AI',
    'Data Science',
    'Computer Vision',
    'Natural Language Processing',
    'Automation',
    'Real-World Innovation'
  ]

  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#062b59] tracking-tight mb-6">
          PROBLEM STATEMENT
        </h2>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl text-center mb-16 leading-relaxed">
          AITHON focuses on solving real-world challenges through innovative technology.
          Participants can build solutions across a variety of cutting-edge AI and data domains.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16">
          {domains.map((domain, idx) => (
            <div 
              key={idx}
              className="bg-[#faf9f6] border border-[#edebe6] p-8 flex items-center justify-center text-center group hover:bg-white hover:border-[#2563eb] hover:shadow-xs transition-all duration-300 rounded-lg"
            >
              <h3 className="text-base sm:text-lg font-bold text-[#062b59] group-hover:text-[#2563eb] transition-colors">
                {domain}
              </h3>
            </div>
          ))}
        </div>

        <a 
          href="#guidelines"
          className="bg-[#faf9f6] hover:bg-[#062b59] text-[#062b59] hover:text-white border-2 border-[#062b59] px-8 py-4 font-bold text-xs uppercase tracking-wider transition-all duration-300 rounded-lg shadow-xs"
        >
          VIEW ELIGIBILITY & GUIDELINES
        </a>
      </div>
    </section>
  )
}
