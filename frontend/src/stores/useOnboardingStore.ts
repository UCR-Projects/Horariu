import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface OnboardingState {
  hasCompletedOnboarding: boolean
  currentStep: number
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  completeOnboarding: () => void
  skipOnboarding: () => void
  resetOnboarding: () => void
}

const TOTAL_STEPS = 3

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      currentStep: 0,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get()
        if (currentStep < TOTAL_STEPS - 1) {
          set({ currentStep: currentStep + 1 })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 })
        }
      },

      completeOnboarding: () =>
        set({
          hasCompletedOnboarding: true,
          currentStep: 0,
        }),

      skipOnboarding: () =>
        set({
          hasCompletedOnboarding: true,
        }),

      resetOnboarding: () =>
        set({
          hasCompletedOnboarding: false,
          currentStep: 0,
        }),
    }),
    {
      name: 'horariu-onboarding',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

