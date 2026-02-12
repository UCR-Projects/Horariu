import { useState, useEffect, useMemo } from 'react'
import useScheduleStore from '@/stores/useScheduleStore'
import ScheduleTable from './ScheduleTable'
import EmptyScheduleTable from './EmptyScheduleTable'
import { SCHEDULES_PER_PAGE } from '@/utils/constants'
import { CustomPagination } from '@/components/shared'
import { useI18n } from '@/hooks/useI18n'

const SchedulesList = () => {
  const { t } = useI18n()
  const scheduleData = useScheduleStore((state) => state.scheduleData)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const mainContainer = document.querySelector('main')
    if (mainContainer) {
      mainContainer.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [scheduleData])

  const totalSchedules = scheduleData?.schedules?.length ?? 0
  const totalPages = Math.ceil(totalSchedules / SCHEDULES_PER_PAGE)
  const showPagination = totalSchedules > SCHEDULES_PER_PAGE

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

  if (!scheduleData) return <EmptyScheduleTable />

  return (
    <div className="w-full max-w-8xl mx-auto p-4">
      {totalSchedules > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              {t('pagination.showingResults', {
                start: (currentPage - 1) * SCHEDULES_PER_PAGE + 1,
                end: Math.min(currentPage * SCHEDULES_PER_PAGE, totalSchedules),
                total: totalSchedules,
              })}
            </span>
            {showPagination && (
              <span className="text-sm text-muted-foreground">
                {t('pagination.pageInfo', {
                  current: currentPage,
                  total: totalPages,
                })}
              </span>
            )}
          </div>

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
      ) : (
        <EmptyScheduleTable />
      )}
    </div>
  )
}

export default SchedulesList
