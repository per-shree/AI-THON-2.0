import { CheckIcon } from './Icons'

export default function RegistrationProgress({ currentStep, steps, onStepClick }) {
  const totalSteps = steps.length
  const progressPercent = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0

  return (
    <div className="w-full mb-8 sm:mb-10 select-none">
      <div className="relative flex items-center justify-between max-w-2xl mx-auto px-3 sm:px-6">
        {/* Background Track Line */}
        <div className="absolute left-8 right-8 top-4 sm:top-5 -translate-y-1/2 h-[2px] bg-[#edebe6] -z-0" />

        {/* Active Progress Fill Line */}
        <div
          className="absolute left-8 top-4 sm:top-5 -translate-y-1/2 h-[2.5px] bg-gradient-to-r from-[#062b59] via-[#1d4ed8] to-[#2563eb] transition-all duration-500 ease-out -z-0"
          style={{
            width: `calc(${progressPercent}% - ${(progressPercent / 100) * 40}px)`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep
          const isActive = step.number === currentStep
          const isPending = step.number > currentStep

          return (
            <div
              key={step.number}
              className="flex flex-col items-center relative z-10"
            >
              {/* Circular Step Badge */}
              <button
                type="button"
                disabled={isPending}
                onClick={() => isCompleted && onStepClick && onStepClick(step.number)}
                aria-label={`Step ${step.number}: ${step.title}`}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#062b59] text-white cursor-pointer hover:bg-[#2563eb] shadow-xs hover:scale-105'
                    : isActive
                    ? 'bg-white text-[#2563eb] border-2 border-[#2563eb] ring-4 ring-blue-100 shadow-sm scale-110'
                    : 'bg-[#faf9f6] text-slate-400 border border-[#edebe6] cursor-not-allowed'
                }`}
              >
                {isCompleted ? (
                  <CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                ) : (
                  <span>0{step.number}</span>
                )}
              </button>

              {/* Step Title */}
              <div className="mt-2 sm:mt-2.5 text-center">
                <span
                  className={`block text-[9.5px] sm:text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'text-[#2563eb]'
                      : isCompleted
                      ? 'text-[#062b59]'
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
