export default function WhyAithon() {
  const pillars = [
    {
      num: '01',
      title: 'Real-World Problem Solving',
      desc: 'Address genuine industry and social challenges with functional AI software prototypes.',
    },
    {
      num: '02',
      title: 'AI & Emerging Technologies',
      desc: 'Build with state-of-the-art machine learning models, generative AI, LLMs, and computer vision.',
    },
    {
      num: '03',
      title: 'National Exposure',
      desc: 'Showcase your innovations alongside talented student engineering teams from across India.',
    },
    {
      num: '04',
      title: 'Professional Networking',
      desc: 'Connect with peers, researchers, and domain experts in the AI space.',
    },
    {
      num: '05',
      title: 'Recognition & Rewards',
      desc: 'Compete for ₹1,00,000* in total prizes and institutional recognition for your technical excellence.',
    },
  ]

  return (
    <section className="w-full bg-[#f4f8fc] py-20 lg:py-28 px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-bold text-[#2563eb] uppercase tracking-widest">
            EVENT HIGHLIGHTS
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#062b59]">
            WHY PARTICIPATE IN AITHON 2.0?
          </h2>
          <p className="text-slate-600 text-base">
            Designed to foster collaborative innovation, hone technical skills, and accelerate AI development.
          </p>
        </div>

        {/* Clean 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((p) => (
            <div key={p.num} className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-[#2563eb] block">{p.num}</span>
              <h3 className="text-lg font-bold text-[#062b59]">{p.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
