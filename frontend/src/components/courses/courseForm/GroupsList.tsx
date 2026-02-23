import { CourseFormValuesType } from '@/validation/schemas/course.schema'
import { Edit2, Eye, EyeOff } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { useI18n } from '@/hooks/useI18n'
import { DeleteConfirmationDialog } from '@/components/shared'
import { tokens } from '@/styles'

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
  const { t } = useI18n('courses')

  if (groups.length === 0) {
    return (
      <div className="border rounded-md p-3 text-center text-xs text-muted-foreground italic">
        {t('noGroupsYet')}
      </div>
    )
  }

  return (
    <Accordion type="single" collapsible className="border rounded-md">
      {groups.map((group, index) => {
        const isLast = index === groups.length - 1
        const isVisible = group.isActive !== false
        return (
          <AccordionItem key={index} value={`group-${index}`} className="border-b last:border-b-0">
            <AccordionTrigger
              className={`flex items-center w-full px-3 py-2 transition-colors group cursor-pointer ${
                !isVisible ? 'opacity-50' : ''
              }`}
            >
              <span
                className={`text-sm font-medium transition-colors flex-1 text-left ${
                  isVisible ? 'text-sky-600' : 'text-muted-foreground line-through'
                }`}
              >
                {group.name}
              </span>
              <div className="flex items-center space-x-2 ml-auto" role="group" aria-label={t('common:accessibility.groupActions', { groupName: group.name })}>
                <span
                  role="button"
                  tabIndex={0}
                  className={`inline-flex items-center justify-center ${tokens.interactive.sm} rounded-md hover:bg-accent transition-colors cursor-pointer`}
                  aria-label={isVisible ? t('common:accessibility.hideGroup', { groupName: group.name }) : t('common:accessibility.showGroup', { groupName: group.name })}
                  aria-pressed={isVisible}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleGroupVisibility(index)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      onToggleGroupVisibility(index)
                    }
                  }}
                >
                  {isVisible ? (
                    <Eye className={`${tokens.icon.sm} text-icon-muted`} aria-hidden="true" />
                  ) : (
                    <EyeOff className={`${tokens.icon.sm} text-icon-muted`} aria-hidden="true" />
                  )}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  className={`inline-flex items-center justify-center ${tokens.interactive.sm} rounded-md hover:bg-accent transition-colors cursor-pointer`}
                  aria-label={t('common:accessibility.editGroup', { groupName: group.name })}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditGroup(index)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      onEditGroup(index)
                    }
                  }}
                >
                  <Edit2 className={`${tokens.icon.sm} text-icon-muted`} aria-hidden="true" />
                </span>
                <DeleteConfirmationDialog
                  itemName={group.name}
                  onConfirm={() => onDeleteGroup(index)}
                  title={t('confirmations.deleteGroup.title')}
                  description={t('confirmations.deleteGroup.description', {
                    itemName: group.name,
                  })}
                  triggerClassName="hover:bg-accent"
                  useSpanTrigger
                />
              </div>
            </AccordionTrigger>
            <AccordionContent
              className={`px-4 py-2 bg-muted/50 text-sm ${
                isLast ? 'rounded-b-sm' : ''
              } ${!isVisible ? 'opacity-50' : ''}`}
            >
              <div className="space-y-1">
                {group.schedule
                  .filter((s) => s.active)
                  .map((schedule) => (
                    <div
                      key={schedule.day}
                      className="flex items-center justify-between text-muted-foreground py-1 border-b last:border-b-0"
                    >
                      <span className="font-medium">{t(`common:days.${schedule.day}.short`)}</span>
                      <div className="flex flex-col items-end space-y-1">
                        {schedule.timeBlocks
                          .sort((a, b) => a.start.localeCompare(b.start))
                          .map((block, blockIndex) => (
                            <span key={blockIndex} className="text-xs">
                              {block.start} - {block.end}
                            </span>
                          ))}
                      </div>
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
