import { CourseFormValuesType } from '@/validation/schemas/course.schema'
import { Trash2, Edit2 } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { useTranslation } from 'react-i18next'

interface GroupsListProps {
  groups: CourseFormValuesType['groups']
  onEditGroup: (index: number) => void
  onDeleteGroup: (index: number) => void
}

export function GroupsList({
  groups,
  onEditGroup,
  onDeleteGroup,
}: GroupsListProps) {
  const { t } = useTranslation()

  if (groups.length === 0) {
    return (
      <div className='border rounded-md p-3 text-center text-xs text-neutral-500 italic'>
        {t('noGroupsYet')}
      </div>
    )
  }

  return (
    <Accordion type='single' collapsible className='border rounded-md'>
      {groups.map((group, index) => {
        const isLast = index === groups.length - 1
        return (
          <AccordionItem
            key={index}
            value={`group-${index}`}
            className='border-b last:border-b-0'
          >
            <AccordionTrigger className='px-3 py-2 transition-colors group cursor-pointer'>
              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-sky-600'>
                  {group.name}
                </span>
                <div className='flex items-center space-x-2'>
                  <span
                    className='inline-flex items-center justify-center h-7 w-7 rounded-md dark:hover:bg-neutral-800'
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditGroup(index)
                    }}
                  >
                    <Edit2 className='h-4 w-4 text-neutral-600' />
                  </span>
                  <span
                    className='inline-flex items-center justify-center h-7 w-7 rounded-md dark:hover:bg-neutral-800'
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteGroup(index)
                    }}
                  >
                    <Trash2 className='h-4 w-4 text-neutral-600' />
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent
              className={`px-4 py-2 bg-neutral-50 dark:bg-neutral-900 text-sm ${isLast ? 'rounded-b-sm' : ''}`}
            >
              <div className='space-y-1'>
                {group.schedule
                  .filter((s) => s.active)
                  .map((schedule) => (
                    <div
                      key={schedule.day}
                      className='flex justify-between text-neutral-500 py-1 border-b last:border-b-0 '
                    >
                      <span className='font-medium'>
                        {t(`days.${schedule.day}.short`)}
                      </span>
                      <span>
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
