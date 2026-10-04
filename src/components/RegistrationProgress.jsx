import { CheckIcon } from './Icons'
import { BookOpen } from 'lucide-react'

export default function RegistrationProgress({
  currentStep,
  steps,
  onStepClick,
  maxStepReached = currentStep,
}) {
  const totalSteps = steps.length
  const isAllCompleted = currentStep === 5

  // Furthest step reached (at least currentStep)
  const maxReached = Math.max(currentStep, maxStepReached)

  // Indexes in the steps array
  const currentIndex = Math.max(0, steps.findIndex((s) => s.number === currentStep))
  const maxIndex = Math.max(0, steps.findIndex((s) => s.number === maxReached))

  // Percentages along the track line (0% to 100%)
  const progressPercent = totalSteps > 1
    ? (isAllCompleted ? 100 : (maxIndex / (totalSteps - 1)) * 100)
    : 0

  return (
    <div className="w-full mb-8 sm:mb-10 select-none">
      <div className="relative flex items-center justify-between max-w-2xl mx-auto px-3 sm:px-6">
        {/* Full Track Container spanning from center of first step button to center of last step button */}
        {/* Button width is 32px on mobile (center = 12px padding + 16px = 28px) */}
        {/* Button width is 40px on sm+ (center = 24px padding + 20px = 44px) */}
        <div className="absolute left-[28px] right-[28px] sm:left-[44px] sm:right-[44px] top-4 sm:top-5 -translate-y-1/2 h-[2.5px] bg-[#edebe6] rounded-full -z-0 overflow-hidden">
          {/* Active / Unlocked Progress Fill Line */}
          <div
            className={`h-full transition-all duration-500 ease-out rounded-full ${
              isAllCompleted
                ? 'bg-emerald-600'
                : 'bg-gradient-to-r from-[#062b59] via-[#1d4ed8] to-[#2563eb]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {steps.map((step) => {
          const isCurrent = step.number === currentStep

          // Step completion logic:
          // If all completed (step 5 reached), every step is completed.
          // Otherwise, completed if before currentStep OR before maxReached (when not currently active).
          const isCompleted = isAllCompleted
            ? true
            : step.number < currentStep || (step.number < maxReached && !isCurrent)

          const isActive = !isAllCompleted && isCurrent
          const isUnlocked = !isAllCompleted && step.number <= maxReached && step.number !== 5
          const isPending = !isUnlocked && !isActive && !isCompleted

          return (
            <div
              key={step.number}
              className="flex flex-col items-center relative z-10"
            >
              {/* Circular Step Badge */}
              <button
                type="button"
                disabled={isPending || isAllCompleted}
                onClick={() => isUnlocked && onStepClick && onStepClick(step.number)}
                aria-label={`Step ${step.number}: ${step.title}`}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all duration-300 ${
                  isAllCompleted && step.number === 5
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-110'
                    : isActive
                    ? 'bg-white text-[#2563eb] border-2 border-[#2563eb] ring-4 ring-blue-100 shadow-sm scale-110'
                    : isCompleted
                    ? 'bg-[#062b59] text-white cursor-pointer hover:bg-[#2563eb] shadow-xs hover:scale-105'
                    : isUnlocked
                    ? 'bg-[#062b59] text-white cursor-pointer hover:bg-[#2563eb] shadow-xs hover:scale-105'
                    : 'bg-[#faf9f6] text-slate-400 border border-[#edebe6] cursor-not-allowed'
                }`}
              >
                {isCompleted && !isActive ? (
                  <CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                ) : step.number === 0 ? (
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <span>0{step.number}</span>
                )}
              </button>

              {/* Step Title */}
              <div className="mt-2 sm:mt-2.5 text-center">
                <span
                  className={`block text-[9.5px] sm:text-[11px] font-bold tracking-tight transition-colors duration-200 ${
                    isAllCompleted && step.number === 5
                      ? 'text-emerald-700 font-extrabold'
                      : isActive
                      ? 'text-[#2563eb]'
                      : isCompleted
                      ? 'text-[#062b59]'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="hidden sm:inline whitespace-nowrap">{step.title}</span>
                  <span className="inline sm:hidden">{step.shortTitle || step.title}</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
