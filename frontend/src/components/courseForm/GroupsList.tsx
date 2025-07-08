import { CourseFormValuesType } from '@/validation/schemas/course.schema'
import { Edit2, Eye, EyeOff } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { useTranslation } from 'react-i18next'
import DeleteConfirmationDialog from '../DeleteConfirmationDialog'

interface GroupsListProps {
  groups: CourseFormValuesType['groups']
  onEditGroup: (index: number) => void
  onDeleteGroup: (index: number) => void
  onToggleGroupVisibility: (index: number) => void
}

export function GroupsList({
  groups,
  onEditGroup,
  onDeleteGroup,
  onToggleGroupVisibility,
}: GroupsListProps) {
  const { t } = useTranslation()

  if (groups.length === 0) {
    return (
      <div className='border rounded-md p-3 text-center text-xs text-muted-foreground italic'>
        {t('noGroupsYet')}
      </div>
    )
  }

  return (
    <Accordion type='single' collapsible className='border rounded-md'>
      {groups.map((group, index) => {
        const isLast = index === groups.length - 1
        const isVisible = group.isActive !== false

        return (
          <AccordionItem
            key={index}
            value={`group-${index}`}
            className='border-b last:border-b-0'
          >
            <AccordionTrigger
              className={`px-3 py-2 transition-colors group cursor-pointer ${
                !isVisible ? 'opacity-50' : ''
              }`}
            >
              <div className='flex items-center justify-between w-full'>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isVisible
                      ? 'text-sky-600'
                      : 'text-muted-foreground line-through'
                  }`}
                >
                  {group.name}
                </span>
                <div className='flex items-center space-x-2'>
                  <span
                    className='inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent transition-colors'
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleGroupVisibility(index)
                    }}
                  >
                    {isVisible ? (
                      <Eye className='h-4 w-4 text-muted-foreground' />
                    ) : (
                      <EyeOff className='h-4 w-4 text-muted-foreground' />
                    )}
                  </span>

                  <span
                    className='inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent transition-colors'
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditGroup(index)
                    }}
                  >
                    <Edit2 className='h-4 w-4 text-muted-foreground' />
                  </span>

                  <span
                    className='inline-flex items-center justify-center h-7 w-7 rounded-md transition-colors'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DeleteConfirmationDialog
                      itemName={group.name}
                      onConfirm={() => onDeleteGroup(index)}
                      title={t('confirmDeleteGroup')}
                      description={t('confirmDeleteGroupDescription', {
                        itemName: group.name,
                      })}
                      triggerClassName='hover:bg-accent'
                    />
                  </span>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent
              className={`px-4 py-2 bg-muted/50 text-sm ${
                isLast ? 'rounded-b-sm' : ''
              } ${!isVisible ? 'opacity-50' : ''}`}
            >
              <div className='space-y-1'>
                {group.schedule
                  .filter((s) => s.active)
                  .map((schedule) => (
                    <div
                      key={schedule.day}
                      className='flex justify-between text-muted-foreground py-1 border-b last:border-b-0'
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
