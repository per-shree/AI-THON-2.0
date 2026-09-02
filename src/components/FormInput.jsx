export default function FormInput({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  icon: Icon,
  options = [],
  rows = 3,
  className = '',
  helperText,
}) {
  const isSelect = type === 'select'
  const isTextarea = type === 'textarea'

  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="text-xs font-bold uppercase tracking-wider text-[#062b59] flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-[#ea580c] font-bold">*</span>}
          </span>
          {helperText && <span className="text-[11px] text-slate-500 font-normal normal-case">{helperText}</span>}
        </label>
      )}

      <div className="relative rounded-lg group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#2563eb] transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {isSelect ? (
          <select
            id={id || name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full rounded-lg bg-white border text-slate-800 text-sm font-sans focus:outline-none transition-all duration-200 cursor-pointer shadow-xs ${
              Icon ? 'pl-10' : 'pl-3.5'
            } pr-8 py-2.5 ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-[#edebe6] hover:border-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
            }`}
          >
            <option value="" disabled className="bg-white text-slate-400">
              {placeholder || 'Select an option...'}
            </option>
            {options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt
              const lbl = typeof opt === 'object' ? opt.label : opt
              return (
                <option key={val} value={val} className="bg-white text-slate-800 py-1">
                  {lbl}
                </option>
              )
            })}
          </select>
        ) : isTextarea ? (
          <textarea
            id={id || name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={rows}
            className={`w-full rounded-lg bg-white border text-slate-800 placeholder:text-slate-400 text-sm font-sans focus:outline-none transition-all duration-200 resize-none shadow-xs ${
              Icon ? 'pl-10' : 'pl-3.5'
            } pr-3.5 py-2.5 ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-[#edebe6] hover:border-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
            }`}
          />
        ) : (
          <input
            type={type}
            id={id || name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`w-full rounded-lg bg-white border text-slate-800 placeholder:text-slate-400 text-sm font-sans focus:outline-none transition-all duration-200 shadow-xs ${
              Icon ? 'pl-10' : 'pl-3.5'
            } pr-3.5 py-2.5 ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-[#edebe6] hover:border-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
            }`}
          />
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1 animate-fadeIn">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}
