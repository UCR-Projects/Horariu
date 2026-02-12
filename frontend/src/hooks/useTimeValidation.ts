import { useMemo, useCallback } from 'react'
import { START_TIMES, END_TIMES } from '@/utils/constants'

interface UseTimeValidationOptions {
  startTime: string
}

interface UseTimeValidationReturn {
  validEndTimes: string[]
  isEndTimeValid: (start: string, end: string) => boolean
  getValidatedEndTime: (newStart: string, currentEnd: string) => string
}

/**
 * Hook for validating time ranges in schedule selectors.
 * Ensures end times are always after start times.
 */
export function useTimeValidation({
  startTime,
}: UseTimeValidationOptions): UseTimeValidationReturn {
  const validEndTimes = useMemo(() => {
    if (!startTime || startTime === '----') return ['----']
    const startIndex = START_TIMES.indexOf(startTime)
    return ['----', ...END_TIMES.slice(startIndex)]
  }, [startTime])

  const isEndTimeValid = useCallback((start: string, end: string): boolean => {
    if (end === '----') return true
    if (start === '----') return false

    const startIndex = START_TIMES.indexOf(start)
    const endIndex = END_TIMES.indexOf(end)

    return endIndex >= startIndex
  }, [])

  const getValidatedEndTime = useCallback(
    (newStart: string, currentEnd: string): string => {
      if (newStart === '----') return '----'
      if (isEndTimeValid(newStart, currentEnd)) return currentEnd
      return '----'
    },
    [isEndTimeValid]
  )

  return {
    validEndTimes,
    isEndTimeValid,
    getValidatedEndTime,
  }
}

