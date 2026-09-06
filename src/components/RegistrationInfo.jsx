import {
  ClockIcon,
  UsersIcon,
  CalendarIcon,
  InfoIcon,
} from './Icons'

export default function RegistrationInfo() {
  const infoItems = [
    {
      label: 'Form Duration',
      value: '~ 5–8 Minutes',
      icon: ClockIcon,
    },
    {
      label: 'Team Size',
      value: '2–4 Members',
      icon: UsersIcon,
    },
    {
      label: 'Hackathon Duration',
      value: '12 Hours Non-Stop',
      icon: CalendarIcon,
    },
  ]

  return (
    <aside className="w-full space-y-6">
      {/* Registration Info Panel */}
      <div className="rounded-xl bg-white border border-[#edebe6] p-6 shadow-xs">
        {/* Panel Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#edebe6] mb-5">
          <div className="p-2 rounded-lg bg-blue-50 text-[#2563eb]">
            <InfoIcon className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[#062b59] uppercase tracking-wider m-0">
            REGISTRATION INFO
          </h2>
        </div>

        {/* Info Grid / Items */}
        <div className="space-y-3">
          {infoItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-[#faf9f6] border border-[#edebe6] hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-white border border-[#edebe6] flex items-center justify-center text-[#2563eb]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.label}
                    </span>
                    <span className="block text-sm font-bold text-[#062b59]">
                      {item.value}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                    {item.badge}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Perks Note */}
        <div className="mt-5 p-3.5 rounded-lg bg-blue-50/60 border border-blue-100 text-slate-700 text-xs leading-relaxed">
          <span className="text-[#2563eb] font-bold">⚡ Note:</span> Ensure team lead and member details match your college IDs for physical verification on event day.
        </div>
      </div>
    </aside>
  )
}
