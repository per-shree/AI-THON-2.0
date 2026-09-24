import { TrendingUpIcon, TrendingDownIcon } from '../Icons'
import { RollingNumber } from '@kitlangton/rolling-number/react'

export default function StatCard({
  title,
  value,
  change,
  isPositive = true,
  subtext,
  icon: Icon,
}) {
  const isNumeric = typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '')
  const numericVal = isNumeric ? Number(value) : 0

  return (
    <div className="relative rounded-xl bg-[#0d111d] border border-slate-800/90 p-5 hover:border-cyan-500/30 transition-colors duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {isNumeric ? (
              <RollingNumber value={numericVal} duration={500} />
            ) : (
              value
            )}
          </div>
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/30 group-hover:bg-cyan-950/20 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(change || subtext) && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-xs font-mono">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                isPositive ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isPositive ? <TrendingUpIcon className="w-3.5 h-3.5" /> : <TrendingDownIcon className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtext && <span className="text-slate-500 truncate">{subtext}</span>}
        </div>
      )}
    </div>
  )
}
