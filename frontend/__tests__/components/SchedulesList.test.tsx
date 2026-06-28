import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import SchedulesList from '@/components/schedules/SchedulesList'
import useScheduleStore, { ScheduleDataType, StoredCourse } from '@/stores/useScheduleStore'
import { useSavedSchedulesStore, SavedSchedule } from '@/stores/useSavedSchedulesStore'
import { useScheduleFilterStore } from '@/stores/useScheduleFilterStore'
import { useScheduleViewStore } from '@/stores/useScheduleViewStore'
import { useTimeFilterStore } from '@/stores/useTimeFilterStore'
import { DAYS } from '@/utils/constants'
import { Day } from '@/types'

vi.mock('@/hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string, params?: Record<string, number>) => {
      if (key === 'pagination.showingResults' && params) {
        return `Mostrando ${params.start} - ${params.end} de ${params.total} combinaciones`
      }

      return key
    },
  }),
}))

vi.mock('@/components/schedules/ScheduleTable', () => ({
  default: ({ scheduleData, scheduleIndex }: { scheduleData: ScheduleDataType; scheduleIndex: number }) => (
    <div data-testid="schedule-table">{scheduleData.schedules[scheduleIndex][0].courseName}</div>
  ),
}))

vi.mock('@/components/schedules/ScheduleViewToggle', () => ({
  ScheduleViewToggle: () => <div data-testid="view-toggle">view-toggle</div>,
}))

vi.mock('@/components/schedules/ScheduleFilterDropdown', () => ({
  ScheduleFilterDropdown: () => <div data-testid="schedule-filter-dropdown">schedule-filter</div>,
}))

vi.mock('@/components/schedules/ScheduleSourceToggle', () => ({
  ScheduleSourceToggle: ({
    source,
    onSourceChange,
    generatedCount,
    savedCount,
  }: {
    source: 'generated' | 'saved'
    onSourceChange: (source: 'generated' | 'saved') => void
    generatedCount: number
    savedCount: number
  }) => (
    <div>
      <button type="button" onClick={() => onSourceChange('generated')}>
        generated-{generatedCount}-{source}
      </button>
      <button type="button" onClick={() => onSourceChange('saved')}>
        saved-{savedCount}-{source}
      </button>
    </div>
  ),
}))

function createStoredCourse(courseName: string, day: Day, start: string, end: string): StoredCourse {
  return {
    courseName,
    color: 'bg-red-500',
    group: {
      name: `${courseName} Group 1`,
      schedule: DAYS.map((currentDay) => ({
        day: currentDay,
        active: currentDay === day,
        timeBlocks: currentDay === day ? [{ start, end }] : [],
      })),
    },
  }
}

describe('SchedulesList', () => {
  beforeEach(() => {
    act(() => {
      useScheduleStore.setState({
        scheduleData: null,
        isLoading: false,
        error: null,
        isSuccess: false,
      })
      useSavedSchedulesStore.setState({ savedSchedules: [] })
      useScheduleFilterStore.setState({
        activeFilters: {
          savedFirst: false,
          leastGaps: false,
          consecutiveClasses: false,
        },
      })
      useScheduleViewStore.setState({ viewMode: 'list' })
      useTimeFilterStore.setState({ selectedCells: new Map() })
    })
  })

  it('keeps the saved tab accessible when the time filter hides all generated schedules', () => {
    const generatedSchedule = [createStoredCourse('Math 101', 'L', '08:00', '08:50')]
    const savedSchedules: SavedSchedule[] = [
      {
        id: 'saved-1',
        schedule: [createStoredCourse('History 201', 'M', '10:00', '10:50')],
        savedAt: 1,
      },
    ]

    act(() => {
      useScheduleStore.setState({
        scheduleData: { schedules: [generatedSchedule] },
        isLoading: false,
        error: null,
        isSuccess: true,
      })
      useSavedSchedulesStore.setState({ savedSchedules })
      useTimeFilterStore.setState({
        selectedCells: new Map([
          ['08:00 - 08:50-L', { hour: '08:00 - 08:50', day: 'L' }],
        ]),
      })
    })

    render(<SchedulesList />)

    expect(screen.getByText('schedules:timeFilter.allHidden')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'saved-1-generated' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'saved-1-generated' }))

    expect(screen.queryByText('schedules:timeFilter.allHidden')).not.toBeInTheDocument()
    expect(screen.getByTestId('schedule-table')).toHaveTextContent('History 201')
  })
})