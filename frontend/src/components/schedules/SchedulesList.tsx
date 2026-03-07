import { useState, useEffect, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useScheduleStore from '@/stores/useScheduleStore'
import { useScheduleViewStore } from '@/stores/useScheduleViewStore'
import ScheduleTable from './ScheduleTable'
import { ScheduleViewToggle } from './ScheduleViewToggle'
import EmptySchedulesBanner from './EmptySchedulesBanner'
import { SCHEDULES_PER_PAGE } from '@/utils/constants'
import { CustomPagination } from '@/components/shared'
import { useI18n } from '@/hooks/useI18n'

const SchedulesList = () => {
  const { t } = useI18n()
  const scheduleData = useScheduleStore((state) => state.scheduleData)
  const { viewMode } = useScheduleViewStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const totalSchedules = scheduleData?.schedules?.length ?? 0
  const totalPages = Math.ceil(totalSchedules / SCHEDULES_PER_PAGE)
  const showPagination = totalSchedules > SCHEDULES_PER_PAGE

  // Reset when data changes
  useEffect(() => {
    setCurrentPage(1)
    setCarouselIndex(0)
  }, [scheduleData])

  // Scroll to top on page change (list mode)
  useEffect(() => {
    if (viewMode === 'list') {
      const mainContainer = document.querySelector('main')
      if (mainContainer) {
        mainContainer.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }, [currentPage, viewMode])

  // Carousel navigation
  const goToPrevious = useCallback(() => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : totalSchedules - 1))
  }, [totalSchedules])

  const goToNext = useCallback(() => {
    setCarouselIndex((prev) => (prev < totalSchedules - 1 ? prev + 1 : 0))
  }, [totalSchedules])

  // Keyboard navigation for carousel
  useEffect(() => {
    if (viewMode !== 'carousel') return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewMode, goToPrevious, goToNext])

  const currentSchedules = useMemo(
    () =>
      scheduleData?.schedules?.slice(
        (currentPage - 1) * SCHEDULES_PER_PAGE,
        currentPage * SCHEDULES_PER_PAGE
      ) ?? [],
    [scheduleData?.schedules, currentPage]
  )

  const handlePageChange = (page: number): void => {
    setCurrentPage(page)
  }

  if (!scheduleData) return <EmptySchedulesBanner />

  if (totalSchedules === 0) return <EmptySchedulesBanner />

  return (
    <div className="w-full max-w-8xl mx-auto p-4">
      {/* Header with navigation/info + view toggle */}
      <div className="flex justify-between items-center mb-4">
        {viewMode === 'list' ? (
          <span className="text-sm text-muted-foreground">
            {t('pagination.showingResults', {
              start: (currentPage - 1) * SCHEDULES_PER_PAGE + 1,
              end: Math.min(currentPage * SCHEDULES_PER_PAGE, totalSchedules),
              total: totalSchedules,
            })}
          </span>
        ) : (
          /* Carousel navigation inline with toggle */
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={totalSchedules <= 1}
              aria-label="Previous schedule"
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center text-muted-foreground">
              {t('schedules:option')} {carouselIndex + 1} / {totalSchedules}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={totalSchedules <= 1}
              aria-label="Next schedule"
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        <ScheduleViewToggle />
      </div>

      {/* Content */}
      {viewMode === 'carousel' ? (
        <>
          <ScheduleTable scheduleData={scheduleData} scheduleIndex={carouselIndex} />

          {/* Pagination dots for carousel */}
          {totalSchedules > 1 && totalSchedules <= 20 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalSchedules }).map((_, idx) => (
                <button
                  key={idx}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === carouselIndex
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  onClick={() => setCarouselIndex(idx)}
                  aria-label={`Go to schedule ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Keyboard hint */}
          <p className="text-center text-xs text-muted-foreground mt-3 hidden sm:block">
            ← → arrow keys to navigate
          </p>
        </>
      ) : (
        <>
          {currentSchedules.map((_, scheduleIndex) => (
            <div key={scheduleIndex} className="mb-6">
              <ScheduleTable
                scheduleData={scheduleData}
                scheduleIndex={(currentPage - 1) * SCHEDULES_PER_PAGE + scheduleIndex}
              />
            </div>
          ))}

          {showPagination && (
            <div className="flex justify-center mt-6">
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SchedulesList
