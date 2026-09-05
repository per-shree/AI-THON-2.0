export default function TracksSection() {
  const tracks = [
    {
      num: '01',
      name: 'ARTIFICIAL INTELLIGENCE & MACHINE LEARNING',
      desc: 'Build predictive AI models, classification engines, neural network architectures, and automated ML pipelines.',
    },
    {
      num: '02',
      name: 'GENERATIVE AI',
      desc: 'Harness Large Language Models (LLMs), multi-modal generation, prompt architecture, and synthetic media pipelines.',
    },
    {
      num: '03',
      name: 'DATA SCIENCE',
      desc: 'Transform raw data into actionable insights through big data engineering, statistical modeling, and predictive analytics.',
    },
    {
      num: '04',
      name: 'COMPUTER VISION',
      desc: 'Develop spatial AI solutions for object identification, medical image analysis, face detection, and video stream analytics.',
    },
    {
      num: '05',
      name: 'NATURAL LANGUAGE PROCESSING',
      desc: 'Construct speech recognition systems, text analytics engines, Indic language models, and conversational AI assistants.',
    },
    {
      num: '06',
      name: 'AI AUTOMATION',
      desc: 'Engineer autonomous software agents, intelligent document parsing pipelines, and automated workflow solutions.',
    },
    {
      num: '07',
      name: 'SMART TECHNOLOGY',
      desc: 'Combine AI models with IoT hardware sensors, microcontrollers, edge computing devices, and campus tech.',
    },
    {
      num: '08',
      name: 'OPEN INNOVATION',
      desc: 'Pitch and prototype breakthrough AI solutions for any real-world domain with complete creative freedom.',
    },
  ]

  return (
    <section id="tracks" className="w-full bg-white py-20 lg:py-28 px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-bold text-[#2563eb] uppercase tracking-widest">
            COMPETITION DOMAINS
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#062b59]">
            HACKATHON TRACKS
          </h2>
          <p className="text-slate-600 text-base">
            Eight focused domains designed for targeted technological innovation.
          </p>
        </div>

        {/* Clean 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tracks.map((t) => (
            <div key={t.num} className="space-y-3 pt-6 border-t-2 border-slate-200 hover:border-[#2563eb] transition-colors">
              <span className="text-xs font-extrabold text-[#2563eb] block uppercase tracking-wider">{t.num}</span>
              <h3 className="text-base font-extrabold text-[#062b59] leading-snug tracking-tight">{t.name}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{t.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
