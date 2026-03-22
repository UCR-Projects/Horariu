import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Link2, Check, ArrowRight, ArrowLeft, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { useI18n } from '@/hooks/useI18n'
import useCourseStore from '@/stores/useCourseStore'
import useCourseLinkStore from '@/stores/useCourseLinkStore'
import { tokens } from '@/styles'
import { Course, Group, ConnectionSet } from '@/types'
import { groupsHaveConflict } from '@/utils/scheduleConflicts'

// Step 2: Interactive group mapping component
interface GroupMapperProps {
  selectedCourses: Course[]
  connectionSets: ConnectionSet[]
  onAddConnectionSet: (set: ConnectionSet) => void
  onRemoveConnectionSet: (index: number) => void
}

function GroupMapper({ selectedCourses, connectionSets, onAddConnectionSet, onRemoveConnectionSet }: GroupMapperProps) {
  const { t } = useI18n('courses')
  // Track one selected group per course
  const [selections, setSelections] = useState<Record<string, string>>({})

  const handleGroupClick = (courseName: string, groupName: string) => {
    setSelections((prev) => {
      const newSelections = { ...prev }
      if (newSelections[courseName] === groupName) {
        // Deselect if clicking the same group
        delete newSelections[courseName]
      } else {
        // Select this group for this course
        newSelections[courseName] = groupName
      }
      return newSelections
    })
  }

  const isGroupSelected = (courseName: string, groupName: string) => {
    return selections[courseName] === groupName
  }

  // Check if all courses have a selection
  const allCoursesSelected = selectedCourses.every((c) => selections[c.name])

  // Check if current selection already exists in connectionSets
  const isCurrentSelectionDuplicate = allCoursesSelected && connectionSets.some((existingSet) => {
    return selectedCourses.every((c) =>
      existingSet.groups.some((g) => g.course === c.name && g.group === selections[c.name])
    )
  })

  // Check for schedule conflicts between selected groups
  const getSelectedGroups = (): { course: Course; group: Group }[] => {
    if (!allCoursesSelected) return []
    return selectedCourses.map((course) => {
      const group = course.groups.find((g) => g.name === selections[course.name])!
      return { course, group }
    }).filter((item) => item.group) // Filter out undefined groups
  }

  const checkForConflicts = (): string | null => {
    const selectedGroups = getSelectedGroups()
    if (selectedGroups.length < 2) return null

    for (let i = 0; i < selectedGroups.length; i++) {
      for (let j = i + 1; j < selectedGroups.length; j++) {
        const { course: course1, group: group1 } = selectedGroups[i]
        const { course: course2, group: group2 } = selectedGroups[j]

        if (groupsHaveConflict(group1, group2)) {
          return `${course1.name} (${group1.name}) ↔ ${course2.name} (${group2.name})`
        }
      }
    }
    return null
  }

  const conflictMessage = checkForConflicts()
  const hasConflict = !!conflictMessage

  const handleCreateConnection = () => {
    if (!allCoursesSelected || isCurrentSelectionDuplicate || hasConflict) return

    const newSet: ConnectionSet = {
      groups: selectedCourses.map((c) => ({
        course: c.name,
        group: selections[c.name],
      })),
    }
    onAddConnectionSet(newSet)
    setSelections({}) // Clear selections after creating
  }

  // Dynamic grid columns based on number of courses
  const gridCols = selectedCourses.length === 3 ? 'grid-cols-3' : 'grid-cols-2'

  return (
    <div className="space-y-4">
      {/* Courses side by side - dynamic columns */}
      <div className={`grid ${gridCols} gap-4`}>
        {selectedCourses.map((course) => {
          const hasSelection = !!selections[course.name]
          return (
            <div key={course.name} className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: course.color }}
                />
                <span className="text-sm font-medium truncate">{course.name}</span>
                {hasSelection && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </div>
              <div className="space-y-1">
                {course.groups.map((group) => {
                  const isSelected = isGroupSelected(course.name, group.name)

                  return (
                    <div
                      key={group.name}
                      className={`
                        flex items-center justify-between p-2 rounded text-xs cursor-pointer
                        border transition-all
                        ${isSelected ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-border hover:border-primary/50 hover:bg-accent'}
                      `}
                      onClick={() => handleGroupClick(course.name, group.name)}
                    >
                      <span className="truncate">{group.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Conflict warning */}
      {hasConflict && (
        <p className="text-xs text-destructive">
          {t('linking.scheduleConflict')}: {conflictMessage}
        </p>
      )}

      {/* Button to create connection when all courses have a selection */}
      <Button
        onClick={handleCreateConnection}
        disabled={!allCoursesSelected || isCurrentSelectionDuplicate || hasConflict}
        className={`w-full cursor-pointer ${isCurrentSelectionDuplicate || hasConflict ? 'opacity-60' : ''}`}
        variant="outline"
      >
        {isCurrentSelectionDuplicate ? (
          <>
            <Check className="w-4 h-4 mr-2 text-green-500" />
            {t('linking.alreadyAdded')}
          </>
        ) : hasConflict ? (
          <>
            <Link2 className="w-4 h-4 mr-2" />
            {t('linking.addConnection')} ({Object.keys(selections).length}/{selectedCourses.length})
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4 mr-2" />
            {t('linking.addConnection')} ({Object.keys(selections).length}/{selectedCourses.length})
          </>
        )}
      </Button>

      {/* Show current connection sets */}
      {connectionSets.length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-xs font-medium mb-2">{t('linking.currentMappings')}:</p>
          <div className="space-y-2">
            {connectionSets.map((set, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs bg-green-500/10 border border-green-500/30 rounded p-2">
                <div className="flex-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 min-w-0">
                  {set.groups.map((g, gIdx) => (
                    <span key={g.course} className="flex items-center gap-1 whitespace-nowrap">
                      {gIdx > 0 && <Link2 className="w-3 h-3 text-green-600 shrink-0" />}
                      <span className="font-medium truncate max-w-[80px] sm:max-w-none">{g.course}:</span>
                      <span className="truncate">{g.group}</span>
                    </span>
                  ))}
                </div>
                <button
                  className="p-1 hover:bg-destructive/20 rounded cursor-pointer shrink-0"
                  onClick={() => onRemoveConnectionSet(idx)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// View modes for the dialog
type ViewMode = 'list' | 'create-step1' | 'create-step2'

export default function LinkCoursesDialog() {
  const { t } = useI18n('courses')
  const { courses } = useCourseStore()
  const { createLinkWithConnections, deleteLink, updateLinkConnections } = useCourseLinkStore()
  const existingLinks = useCourseLinkStore((state) => state.links)

  const [open, setOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedCourseNames, setSelectedCourseNames] = useState<string[]>([])
  const [connectionSets, setConnectionSets] = useState<ConnectionSet[]>([])
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)

  const linkedCourseNames = existingLinks.flatMap((link) => link.courses)
  const availableCourses = courses.filter((c) => !linkedCourseNames.includes(c.name))
  const selectedCourses = courses.filter((c) => selectedCourseNames.includes(c.name))

  const MAX_COURSES_TO_LINK = 3

  const handleToggleCourse = (courseName: string) => {
    setSelectedCourseNames((prev) => {
      if (prev.includes(courseName)) {
        return prev.filter((n) => n !== courseName)
      }
      if (prev.length >= MAX_COURSES_TO_LINK) {
        return prev
      }
      return [...prev, courseName]
    })
  }

  const handleAddConnectionSet = useCallback((set: ConnectionSet) => {
    setConnectionSets((prev) => [...prev, set])
  }, [])

  const handleRemoveConnectionSet = useCallback((index: number) => {
    setConnectionSets((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleCreateLink = () => {
    if (selectedCourseNames.length >= 2 && connectionSets.length > 0) {
      if (editingLinkId) {
        // Update existing link
        updateLinkConnections(editingLinkId, connectionSets)
        toast.success(t('linking.linkUpdated'))
      } else {
        // Create new link
        createLinkWithConnections(selectedCourseNames, connectionSets)
        toast.success(t('linking.linkCreated'))
      }
      resetToList()
    }
  }

  const handleEditLink = (linkId: string) => {
    const link = existingLinks.find((l) => l.id === linkId)
    if (!link) return

    // Now we store connectionSets directly, so just load them
    setEditingLinkId(linkId)
    setSelectedCourseNames(link.courses)
    setConnectionSets(link.connectionSets)
    setViewMode('create-step2')
  }

  const resetToList = () => {
    setViewMode('list')
    setSelectedCourseNames([])
    setConnectionSets([])
    setEditingLinkId(null)
  }

  const goBackToStep1 = () => {
    setViewMode('create-step1')
    setConnectionSets([]) // Clear connections when going back - course selection may change
  }

  const handleClose = () => {
    setOpen(false)
    resetToList()
  }

  const canProceedToStep2 = selectedCourseNames.length >= 2
  const canCreateLink = connectionSets.length > 0

  const hasExistingLinks = existingLinks.length > 0

  // Determine title based on view mode
  const getTitle = () => {
    if (viewMode === 'list') return t('linking.manageLinks')
    if (viewMode === 'create-step1') return t('linking.newLink')
    if (editingLinkId) return t('linking.editLink')
    return t('linking.connectGroups')
  }

  const getDescription = () => {
    if (viewMode === 'list') return t('linking.manageLinkDescription')
    if (viewMode === 'create-step1') return t('linking.selectCoursesToLink')
    return t('linking.step2Description')
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose()
      else setOpen(true)
    }}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs cursor-pointer"
          disabled={courses.length < 2}
        >
          <Link2 className={tokens.icon.xs} />
          {t('linking.linkCourses')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className={tokens.icon.sm} />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {/* List view - show existing links */}
        {viewMode === 'list' && (
          <div className="py-4 space-y-4">
            {hasExistingLinks ? (
              <div className="space-y-3">
                {existingLinks.map((link) => (
                  <div key={link.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 flex flex-wrap items-center gap-x-1 gap-y-1 min-w-0">
                        {link.courses.map((courseName, idx) => {
                          const course = courses.find((c) => c.name === courseName)
                          return (
                            <span key={courseName} className="flex items-center gap-1.5 text-sm">
                              {course && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: course.color }}
                                />
                              )}
                              <span className="truncate max-w-[100px] sm:max-w-none">{courseName}</span>
                              {idx < link.courses.length - 1 && (
                                <Link2 className="w-3 h-3 text-muted-foreground shrink-0" />
                              )}
                            </span>
                          )
                        })}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer hover:bg-accent"
                          onClick={() => handleEditLink(link.id)}
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer hover:bg-destructive/10"
                          onClick={() => deleteLink(link.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {link.connectionSets.length} {link.connectionSets.length === 1 ? 'conexión' : 'conexiones'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Link2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">{t('linking.noLinksYet')}</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  {t('linking.emptyStateDescription')}
                </p>
              </div>
            )}

            {availableCourses.length >= 2 && (
              <div className="flex justify-center pt-2">
                <Button
                  onClick={() => setViewMode('create-step1')}
                  className="cursor-pointer"
                >
                  <Link2 className={tokens.icon.xs} />
                  {t('linking.createNewLink')}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Create step 1 - select courses */}
        {viewMode === 'create-step1' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {t('linking.selectUpTo', { max: MAX_COURSES_TO_LINK })} ({selectedCourseNames.length}/{MAX_COURSES_TO_LINK})
              </p>
              {availableCourses.length < 2 ? (
                <p className="text-sm text-muted-foreground">
                  {t('linking.noCoursesToLink')}
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableCourses.map((course) => {
                    const isSelected = selectedCourseNames.includes(course.name)
                    const isDisabled = !isSelected && selectedCourseNames.length >= MAX_COURSES_TO_LINK
                    return (
                      <div
                        key={course.name}
                        className={`flex items-center gap-3 p-2 rounded border cursor-pointer ${
                          isSelected ? 'border-primary bg-accent' : 'border-transparent'
                        } ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-accent'}`}
                        onClick={() => !isDisabled && handleToggleCourse(course.name)}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="text-sm truncate">{course.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {course.groups.length} grupos
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create step 2 - connect groups */}
        {viewMode === 'create-step2' && (
          <div className="py-4 space-y-4">
            <GroupMapper
              selectedCourses={selectedCourses}
              connectionSets={connectionSets}
              onAddConnectionSet={handleAddConnectionSet}
              onRemoveConnectionSet={handleRemoveConnectionSet}
            />
          </div>
        )}

        <DialogFooter>
          {viewMode === 'list' && (
            <Button variant="outline" onClick={handleClose} className="cursor-pointer">
              {t('linking.close')}
            </Button>
          )}

          {viewMode === 'create-step1' && (
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={resetToList} className="cursor-pointer">
                <ArrowLeft className={tokens.icon.xs} />
                {t('linking.back')}
              </Button>
              <Button
                onClick={() => setViewMode('create-step2')}
                disabled={!canProceedToStep2}
                className="cursor-pointer"
              >
                {t('linking.next')}
                <ArrowRight className={tokens.icon.xs} />
              </Button>
            </div>
          )}

          {viewMode === 'create-step2' && (
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={editingLinkId ? resetToList : goBackToStep1} className="cursor-pointer">
                <ArrowLeft className={tokens.icon.xs} />
                {editingLinkId ? t('linking.cancel') : t('linking.back')}
              </Button>
              <Button onClick={handleCreateLink} disabled={!canCreateLink} className="cursor-pointer">
                <Link2 className={tokens.icon.xs} />
                {editingLinkId ? t('linking.saveChanges') : t('linking.createLink')}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

