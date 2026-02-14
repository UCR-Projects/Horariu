import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateScheduleService } from '@/services/generateScheduleService'
import { publicApi } from '@/services/apiConfig'
import { ApiError, ApiErrorCode } from '@/services/errors'
import { Course, Day } from '@/types'
import { DAYS } from '@/utils/constants'

vi.mock('@/services/apiConfig', () => ({
  publicApi: {
    post: vi.fn(),
  },
}))

function createTestCourse(name: string): Course {
  return {
    name,
    color: 'bg-red-500',
    isActive: true,
    groups: [
      {
        name: 'Group 1',
        isActive: true,
        schedule: DAYS.map((day: Day) => ({
          day,
          active: day === 'L',
          timeBlocks: day === 'L' ? [{ start: '08:00', end: '09:30' }] : [],
        })),
      },
    ],
  }
}

describe('generateScheduleService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateSchedule', () => {
    it('should call API with converted course data', async () => {
      const mockResponse = {
        data: {
          schedules: [],
        },
      }
      vi.mocked(publicApi.post).mockResolvedValue(mockResponse)

      const courses = [createTestCourse('Math 101')]
      await generateScheduleService.generateSchedule(courses)

      expect(publicApi.post).toHaveBeenCalledWith(
        '/generate',
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Math 101',
            color: 'bg-red-500',
            groups: expect.arrayContaining([
              expect.objectContaining({
                name: 'Group 1',
                schedule: { L: [{ start: '08:00', end: '09:30' }] },
              }),
            ]),
          }),
        ]),
        expect.any(Object)
      )
    })

    it('should filter out inactive groups', async () => {
      const mockResponse = {
        data: {
          schedules: [],
        },
      }
      vi.mocked(publicApi.post).mockResolvedValue(mockResponse)

      const course = createTestCourse('Math 101')
      course.groups.push({
        name: 'Group 2',
        isActive: false,
        schedule: DAYS.map((day: Day) => ({
          day,
          active: day === 'M',
          timeBlocks: day === 'M' ? [{ start: '10:00', end: '11:30' }] : [],
        })),
      })

      await generateScheduleService.generateSchedule([course])

      const callArgs = vi.mocked(publicApi.post).mock.calls[0][1] as Array<{
        groups: Array<{ name: string }>
      }>
      expect(callArgs[0].groups).toHaveLength(1)
      expect(callArgs[0].groups[0].name).toBe('Group 1')
    })

    it('should convert API response to internal format', async () => {
      const mockResponse = {
        data: {
          schedules: [
            [
              {
                courseName: 'Math 101',
                color: 'bg-red-500',
                group: {
                  name: 'Group 1',
                  schedule: { L: [{ start: '08:00', end: '09:30' }] },
                },
              },
            ],
          ],
        },
      }
      vi.mocked(publicApi.post).mockResolvedValue(mockResponse)

      const result = await generateScheduleService.generateSchedule([createTestCourse('Math 101')])

      expect(result.schedules[0][0].group.schedule).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            day: 'L',
            active: true,
            timeBlocks: [{ start: '08:00', end: '09:30' }],
          }),
        ])
      )
    })

    it('should throw ApiError on failure', async () => {
      const apiError = new ApiError('Test error', ApiErrorCode.SERVER, 500, true)
      vi.mocked(publicApi.post).mockRejectedValue(apiError)

      await expect(
        generateScheduleService.generateSchedule([createTestCourse('Math 101')])
      ).rejects.toThrow(ApiError)
    })

    it('should pass timeout option to API call', async () => {
      const mockResponse = { data: { schedules: [] } }
      vi.mocked(publicApi.post).mockResolvedValue(mockResponse)

      await generateScheduleService.generateSchedule([createTestCourse('Math 101')], {
        timeout: 60000,
      })

      expect(publicApi.post).toHaveBeenCalledWith('/generate', expect.any(Array), { timeout: 60000 })
    })
  })
})

