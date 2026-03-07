import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Calendar, Sparkles, ArrowRight, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useI18n } from '@/hooks/useI18n'

const STEPS = [
  { icon: BookOpen },
  { icon: Calendar },
  { icon: Sparkles },
]

export function OnboardingFlow() {
  const { t } = useI18n('common')
  const { currentStep, setStep, nextStep, skipOnboarding, completeOnboarding } =
    useOnboardingStore()

  const handleGetStarted = () => {
    completeOnboarding()
  }

  const stepKeys = ['step1', 'step2', 'step3'] as const

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 sm:p-8 animate-fade-in">
      <div className="max-w-lg text-center">
        {/* Step indicators */}
        <div className="flex justify-center gap-4 mb-8">
          {STEPS.map((step, idx) => {
            const StepIcon = step.icon
            const isActive = idx === currentStep
            const isPast = idx < currentStep

            return (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`rounded-full p-4 transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-primary-foreground scale-110 shadow-lg'
                    : isPast
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                aria-label={`Step ${idx + 1}`}
                aria-current={isActive ? 'step' : undefined}
              >
                <StepIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
            )
          })}
        </div>

        {/* Step content with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              {t(`onboarding.${stepKeys[currentStep]}.title`)}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t(`onboarding.${stepKeys[currentStep]}.desc`)}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {currentStep < STEPS.length - 1 ? (
              <Button size="lg" onClick={nextStep} className="gap-2">
                {t('actions.next')}
                <ArrowRight className="h-5 w-5" />
              </Button>
            ) : (
              <Button size="lg" onClick={handleGetStarted} className="gap-2">
                <Rocket className="h-5 w-5" />
                {t('onboarding.getStarted')}
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={skipOnboarding}
            className="text-muted-foreground"
          >
            {t('onboarding.skip')}
          </Button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              onClick={() => setStep(idx)}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

