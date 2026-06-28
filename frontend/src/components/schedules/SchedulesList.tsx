import { useState, useEffect, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useScheduleStore, { ScheduleDataType } from '@/stores/useScheduleStore'
import { useScheduleViewStore } from '@/stores/useScheduleViewStore'
import { useSavedSchedulesStore } from '@/stores/useSavedSchedulesStore'
import { useScheduleFilterStore } from '@/stores/useScheduleFilterStore'
import { useTimeFilterStore } from '@/stores/useTimeFilterStore'
import { storedScheduleConflictsWithBlockedCells } from '@/utils/timeBlockFilter'
import ScheduleTable from './ScheduleTable'
import { ScheduleViewToggle } from './ScheduleViewToggle'
import { ScheduleSourceToggle, ScheduleSource } from './ScheduleSourceToggle'
import { ScheduleFilterButton } from './ScheduleFilterButton'
import { TableStyleSelector } from './TableStyleSelector'
import EmptySchedulesBanner from './EmptySchedulesBanner'
import { EmptyState, CustomPagination } from '@/components/shared'
import { SCHEDULES_PER_PAGE } from '@/utils/constants'
import { useI18n } from '@/hooks/useI18n'
import {
  totalGapMinutes,
  classSegmentCount,
  latestClassEnd,
  earliestClassStart,
} from '@/utils/scheduleMetrics'

const SchedulesList = () => {
  const { t } = useI18n()
  const scheduleData = useScheduleStore((state) => state.scheduleData)
  const { viewMode } = useScheduleViewStore()
  const { savedSchedules, removeSchedule, isScheduleSaved } = useSavedSchedulesStore()
  const { activeFilters } = useScheduleFilterStore()
  const selectedCells = useTimeFilterStore((state) => state.selectedCells)
  const [source, setSource] = useState<ScheduleSource>('generated')
  const [currentPage, setCurrentPage] = useState(1)
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Reset pagination when data, source, or filters change
  useEffect(() => {
    setCurrentPage(1)
    setCarouselIndex(0)
  }, [scheduleData, source, activeFilters, selectedCells])

  // Scroll to top on page change (list mode)
  useEffect(() => {
    if (viewMode === 'list') {
      const mainContainer = document.querySelector('main')
      if (mainContainer) {
        mainContainer.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }, [currentPage, viewMode])

  // Compute filtered/sorted indices for the generated view
  const filteredIndices = useMemo(() => {
    if (!scheduleData?.schedules) return []
    let indices = scheduleData.schedules.map((_, i) => i)

    // 0. Apply time filter — hide schedules containing groups that conflict with blocked cells
    if (selectedCells.size > 0) {
      indices = indices.filter(
        (idx) => !storedScheduleConflictsWithBlockedCells(scheduleData.schedules[idx], selectedCells)
      )
    }

    // 1. Sort by metrics (before savedFirst partitioning, so the sort
    //    applies within each partition)
    const needsSort =
      activeFilters.leastGaps ||
      activeFilters.consecutiveClasses ||
      activeFilters.earlyFinish ||
      activeFilters.lateStart

    if (needsSort) {
      const metrics = indices.map((idx) => ({
        idx,
        gapMinutes: totalGapMinutes(scheduleData.schedules[idx]),
        segments: classSegmentCount(scheduleData.schedules[idx]),
        latestEnd: latestClassEnd(scheduleData.schedules[idx]),
        earliestStart: earliestClassStart(scheduleData.schedules[idx]),
      }))

      // Build the comparator chain in priority order, including only the
      // active filters. Existing priorities (compactness, then idle time)
      // are kept ahead of the time-of-day preferences.
      type Metric = (typeof metrics)[number]
      const comparators: ((a: Metric, b: Metric) => number)[] = []

      if (activeFilters.consecutiveClasses) {
        comparators.push((a, b) => a.segments - b.segments)
      }
      if (activeFilters.leastGaps) {
        comparators.push((a, b) => a.gapMinutes - b.gapMinutes)
      }
      if (activeFilters.earlyFinish && activeFilters.lateStart) {
        // Both active: minimize the daily campus window (leave early, arrive late)
        comparators.push(
          (a, b) =>
            a.latestEnd - a.earliestStart - (b.latestEnd - b.earliestStart)
        )
      } else if (activeFilters.earlyFinish) {
        comparators.push((a, b) => a.latestEnd - b.latestEnd)
      } else if (activeFilters.lateStart) {
        comparators.push((a, b) => b.earliestStart - a.earliestStart)
      }

      // Natural tiebreakers so any single active filter still orders sensibly
      comparators.push((a, b) => a.segments - b.segments)
      comparators.push((a, b) => a.gapMinutes - b.gapMinutes)

      metrics.sort((a, b) => {
        for (const compare of comparators) {
          const diff = compare(a, b)
          if (diff !== 0) return diff
        }
        return 0
      })

      indices = metrics.map((m) => m.idx)
    }

    // 2. savedFirst always partitions on top (preserving sort within each group)
    if (activeFilters.savedFirst) {
      const saved: number[] = []
      const unsaved: number[] = []
      for (const idx of indices) {
        if (isScheduleSaved(scheduleData.schedules[idx])) {
          saved.push(idx)
        } else {
          unsaved.push(idx)
        }
      }
      return [...saved, ...unsaved]
    }

    return indices
  }, [scheduleData?.schedules, activeFilters, isScheduleSaved, selectedCells])

  const activeIndices =
    source === 'generated'
      ? filteredIndices
      : savedSchedules.map((_, i) => i)

  const totalItems = activeIndices.length
  const totalPages = Math.ceil(totalItems / SCHEDULES_PER_PAGE)
  const showPagination = totalItems > SCHEDULES_PER_PAGE

  // Build a ScheduleDataType-compatible object for the saved view
  const savedScheduleData: ScheduleDataType = useMemo(
    () => ({ schedules: savedSchedules.map((s) => s.schedule) }),
    [savedSchedules]
  )

  const activeData = source === 'generated' ? scheduleData! : savedScheduleData

  // Carousel navigation
  const goToPrevious = useCallback(() => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1))
  }, [totalItems])

  const goToNext = useCallback(() => {
    setCarouselIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0))
  }, [totalItems])

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

  const handlePageChange = (page: number): void => {
    setCurrentPage(page)
  }

  const handleSourceChange = (newSource: ScheduleSource) => {
    setSource(newSource)
    setTimeout(() => (document.activeElement as HTMLElement)?.blur(), 0)
  }

  const generatedCount = scheduleData?.schedules?.length ?? 0
  const showTimeFilterEmptyState = source === 'generated' && generatedCount > 0 && totalItems === 0

  // If no generated schedules and on the generated tab, show empty banner
  if (source === 'generated' && generatedCount === 0) {
    return <EmptySchedulesBanner />
  }

  // Tabs + empty state for saved tab, or no data at all but saved tab selected
  const showEmptySaved = source === 'saved' && savedSchedules.length === 0
  if (showEmptySaved) {
    return (
      <div className="w-full max-w-8xl mx-auto p-2 md:p-4">
        <ScheduleSourceToggle
          source={source}
          onSourceChange={handleSourceChange}
          generatedCount={generatedCount}
          savedCount={savedSchedules.length}
        />
        <EmptyState
          icon={Star}
          title={t('schedules:saved.emptyTitle')}
          description={t('schedules:saved.emptyDescription')}
          className="min-h-[60vh]"
        />
      </div>
    )
  }

  // Paginated indices for list mode
  const pageStart = (currentPage - 1) * SCHEDULES_PER_PAGE
  const pageEnd = currentPage * SCHEDULES_PER_PAGE
  const currentPageIndices = activeIndices.slice(pageStart, pageEnd)

  // Current carousel index mapped to actual schedule index
  const currentCarouselScheduleIndex = activeIndices[carouselIndex] ?? 0

  return (
    <div className="w-full max-w-8xl mx-auto p-2 md:p-4">
      {/* Source tabs */}
      <ScheduleSourceToggle
        source={source}
        onSourceChange={handleSourceChange}
        generatedCount={generatedCount}
        savedCount={savedSchedules.length}
      />

      {/* Controls row */}
      <div className="flex justify-between items-center mt-4 mb-4">
        {showTimeFilterEmptyState ? (
          <div />
        ) : viewMode === 'list' ? (
          <span className="text-sm text-muted-foreground">
            {t('pagination.showingResults', {
              start: pageStart + 1,
              end: Math.min(pageEnd, totalItems),
              total: totalItems,
            })}
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={totalItems <= 1}
              aria-label="Previous schedule"
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center text-muted-foreground">
              {t('schedules:option')} {carouselIndex + 1} / {totalItems}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={totalItems <= 1}
              aria-label="Next schedule"
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {source === 'generated' && <ScheduleFilterButton />}
          <TableStyleSelector />
          <ScheduleViewToggle />
        </div>
      </div>

      {/* Content */}
      {showTimeFilterEmptyState ? (
        <EmptyState
          icon={Clock}
          title={t('schedules:timeFilter.allHidden')}
          description={t('schedules:timeFilter.allHiddenDescription')}
          className="min-h-[60vh]"
        />
      ) : viewMode === 'carousel' ? (
        <>
          <ScheduleTable
            scheduleData={activeData}
            scheduleIndex={currentCarouselScheduleIndex}
            showSaveButton={source === 'generated'}
            savedScheduleId={
              source === 'saved'
                ? savedSchedules[currentCarouselScheduleIndex]?.id
                : undefined
            }
            onRemoveSaved={source === 'saved' ? removeSchedule : undefined}
          />

          {totalItems > 1 && totalItems <= 20 && (
            <div className="flex justify-center gap-2 mt-4">
              {activeIndices.map((_, idx) => (
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

          <p className="text-center text-xs text-muted-foreground mt-3 hidden sm:block">
            {t('schedules:view.arrowKeysNavigate')}
          </p>
        </>
      ) : (
        <>
          {currentPageIndices.map((scheduleIdx) => (
            <div key={`${source}-${scheduleIdx}`} className="mb-3 md:mb-6">
              <ScheduleTable
                scheduleData={activeData}
                scheduleIndex={scheduleIdx}
                showSaveButton={source === 'generated'}
                savedScheduleId={
                  source === 'saved' ? savedSchedules[scheduleIdx]?.id : undefined
                }
                onRemoveSaved={source === 'saved' ? removeSchedule : undefined}
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
