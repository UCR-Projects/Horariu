import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ScheduleTable from './ScheduleTable'
import useScheduleStore from '@/stores/useScheduleStore'
import { useI18n } from '@/hooks/useI18n'

export function ScheduleCarousel() {
  const { t } = useI18n('schedules')
  const scheduleData = useScheduleStore((state) => state.scheduleData)
  const [currentIndex, setCurrentIndex] = useState(0)

  const totalSchedules = scheduleData?.schedules?.length ?? 0

  // Reset index when data changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [scheduleData])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSchedules - 1))
  }, [totalSchedules])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalSchedules - 1 ? prev + 1 : 0))
  }, [totalSchedules])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext])

  if (!scheduleData || totalSchedules === 0) return null

  return (
    <div className="w-full animate-fade-in">
      {/* Navigation header - compact */}
      <div className="flex items-center justify-center mb-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={totalSchedules <= 1}
            aria-label="Previous schedule"
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm font-medium min-w-[100px] text-center text-muted-foreground">
            {t('option')} {currentIndex + 1} / {totalSchedules}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={totalSchedules <= 1}
            aria-label="Next schedule"
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Schedule table - uses its own export menu */}
      <ScheduleTable scheduleData={scheduleData} scheduleIndex={currentIndex} />

      {/* Pagination dots (for up to 20 schedules) */}
      {totalSchedules > 1 && totalSchedules <= 20 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalSchedules }).map((_, idx) => (
            <button
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to schedule ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Keyboard hint */}
      <p className="text-center text-xs text-muted-foreground mt-3 hidden sm:block">
        ← → arrow keys to navigate
      </p>
    </div>
  )
}

