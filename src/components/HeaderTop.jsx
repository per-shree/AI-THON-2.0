export default function HeaderTop() {
  return (
    <div className="w-full bg-[#faf9f6] border-b border-[#edebe6] py-2 hidden md:block">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-[#062b59] gap-2">
        <div className="flex items-center gap-4">
          <span className="text-slate-600">Department of Artificial Intelligence & Data Science, Amrutvahini College of Engineering, Sangamner</span>
        </div>
        <div className="flex items-center gap-4 text-slate-600">
          <a href="mailto:contact@aithon.com" className="hover:text-[#2563eb] transition-colors">Contact</a>
        </div>
      </div>
    </div>
  )
}
