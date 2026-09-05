export default function ProblemStatements() {
  const domains = [
    {
      title: 'Artificial Intelligence',
      tag: 'AI Models & Agents',
      desc: 'Predictive models, neural architectures, and multi-agent intelligence systems.'
    },
    {
      title: 'Machine Learning',
      tag: 'ML Pipelines',
      desc: 'Classification engines, regression systems, and automated feature engineering.'
    },
    {
      title: 'Generative AI',
      tag: 'LLMs & Multi-Modal',
      desc: 'Large language models, synthetic media pipelines, and prompt orchestration.'
    },
    {
      title: 'Data Science',
      tag: 'Big Data & Analytics',
      desc: 'Big data engineering, statistical modeling, and real-time data insights.'
    },
    {
      title: 'Computer Vision',
      tag: 'Spatial & Visual AI',
      desc: 'Object recognition, medical imaging analysis, and real-time video analytics.'
    },
    {
      title: 'Natural Language Processing',
      tag: 'Text & Speech AI',
      desc: 'Conversational assistants, Indic language processing, and semantic analysis.'
    },
    {
      title: 'Automation',
      tag: 'Workflow Systems',
      desc: 'Autonomous software agents, document parsing, and enterprise RPA engines.'
    },
    {
      title: 'Real-World Innovation',
      tag: 'Open Track',
      desc: 'Breakthrough technology solutions tackling high-impact societal challenges.'
    }
  ]

  return (
    <section className="bg-white py-20 lg:py-28 px-6 md:px-12 lg:px-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header with Refined Line Spacing */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <p className="text-xs font-extrabold text-[#2563eb] uppercase tracking-widest">
            INNOVATION DOMAINS
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#062b59] tracking-tight leading-tight">
            PROBLEM STATEMENTS
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium pt-2">
            AITHON 2.0 focuses on solving real-world challenges through innovative technology.
            Participants can build solutions across a variety of cutting-edge AI and data domains.
          </p>
        </div>

        {/* Problem Statement Grid with Improved Card Line Heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-14">
          {domains.map((item, idx) => (
            <div 
              key={idx}
              className="bg-[#faf9f6] border border-[#edebe6] p-7 flex flex-col justify-between text-left group hover:bg-white hover:border-[#2563eb] hover:shadow-md transition-all duration-300 rounded-xl space-y-4"
            >
              <div className="space-y-2.5">
                <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-[#2563eb] text-[11px] font-bold tracking-wider uppercase border border-blue-100/80">
                  {item.tag}
                </span>
                <h3 className="text-lg font-extrabold text-[#062b59] leading-snug group-hover:text-[#2563eb] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <a 
          href="#guidelines"
          className="bg-[#faf9f6] hover:bg-[#062b59] text-[#062b59] hover:text-white border-2 border-[#062b59] px-8 py-4 font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-lg shadow-xs"
        >
          VIEW ELIGIBILITY & GUIDELINES
        </a>
      </div>
    </section>
  )
}

