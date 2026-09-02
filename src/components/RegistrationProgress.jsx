import { CheckIcon } from './Icons'

export default function RegistrationProgress({ currentStep, steps, onStepClick }) {
  return (
    <div className="w-full mb-8 lg:mb-10">
      <div className="relative flex items-center justify-between">
        {/* Background Track Line */}
        <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-[2px] bg-[#edebe6] -z-0" />

        {/* Active Progress Fill Line */}
        <div
          className="absolute left-6 top-5 -translate-y-1/2 h-[2px] bg-[#2563eb] transition-all duration-500 ease-out -z-0"
          style={{
            width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 48px * ${
              (currentStep - 1) / (steps.length - 1)
            })`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep
          const isActive = step.number === currentStep
          const isPending = step.number > currentStep

          return (
            <div
              key={step.number}
              className="flex flex-col items-center relative z-10 group"
            >
              {/* Circular Step Badge */}
              <button
                type="button"
                disabled={isPending}
                onClick={() => isCompleted && onStepClick && onStepClick(step.number)}
                aria-label={`Step ${step.number}: ${step.title}`}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#062b59] text-white cursor-pointer hover:bg-[#2563eb]'
                    : isActive
                    ? 'bg-white text-[#2563eb] border-2 border-[#2563eb] ring-4 ring-blue-100 shadow-sm'
                    : 'bg-[#faf9f6] text-slate-400 border border-[#edebe6] cursor-not-allowed'
                }`}
              >
                {isCompleted ? (
                  <CheckIcon className="w-5 h-5 text-white" />
                ) : (
                  <span>{step.number}</span>
                )}
              </button>

              {/* Step Labels */}
              <div className="mt-3 text-center">
                <span
                  className={`block text-[11px] font-bold uppercase tracking-wider ${
                    isActive
                      ? 'text-[#2563eb]'
                      : isCompleted
                      ? 'text-[#062b59]'
                      : 'text-slate-400'
                  }`}
                >
                  STEP {step.number}
                </span>
                <span
                  className={`hidden sm:block text-xs font-semibold tracking-tight mt-0.5 max-w-[130px] ${
                    isActive
                      ? 'text-[#062b59]'
                      : isCompleted
                      ? 'text-slate-600'
                      : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
