import { Button } from '@/components/ui/button'
import { forwardRef, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Edit2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Course } from '@/types'
import { useI18n } from '@/hooks/useI18n'
import { GroupInputsForm } from './GroupInputsForm'
import { CourseInputsForm } from './CourseInputsForm'
import { useCourseFormManager } from '@/hooks/useCourseFormManager'
import { useGroupFormManager } from '@/hooks/useGroupFormManager'
import { tokens } from '@/styles'

interface CourseFormProps {
  existingCourse?: Course
}

interface CourseFormTriggerProps {
  isEditing: boolean
}

const CourseFormTrigger = forwardRef<HTMLButtonElement, CourseFormTriggerProps>(
  ({ isEditing, ...props }, ref) => {
    const { t } = useI18n('courses')

    if (isEditing) {
      return (
        <Button
          ref={ref}
          variant="ghost"
          size="icon"
          className={`${tokens.interactive.sm} hover:bg-interactive-hover cursor-pointer`}
          {...props}
        >
          <Edit2 className={`${tokens.icon.sm} text-icon-muted`} />
        </Button>
      )
    }

    return (
      <Button ref={ref} className="cursor-pointer" {...props}>
        {t('addCourse')}
      </Button>
    )
  }
)

export default function CourseForm({ existingCourse }: CourseFormProps) {
  const isMobile = useIsMobile()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeStep, setActiveStep] = useState<'course' | 'group'>('course')

  // Course form management
  const { courseForm, currentGroups, currentGroupNames, isEditingCourse, onSubmitCourse } =
    useCourseFormManager({
      existingCourse,
      isDialogOpen,
      onSuccess: () => setIsDialogOpen(false),
    })

  // Group form management
  const {
    groupForm,
    editingGroupIndex,
    onSubmitGroup,
    handleEditGroup,
    handleDeleteGroup,
    handleToggleGroupVisibility,
    handleCancelGroupEdit,
  } = useGroupFormManager({
    courseForm,
    currentGroups,
    currentGroupNames,
    activeStep,
    onStepChange: setActiveStep,
  })

  const content =
    activeStep === 'course' ? (
      <CourseInputsForm
        form={courseForm}
        isEditingCourse={isEditingCourse}
        groups={courseForm.watch('groups')}
        onSubmit={onSubmitCourse}
        onAddGroup={() => setActiveStep('group')}
        onEditGroup={handleEditGroup}
        onDeleteGroup={handleDeleteGroup}
        onToggleGroupVisibility={handleToggleGroupVisibility}
        onCancel={() => setIsDialogOpen(false)}
      />
    ) : (
      <GroupInputsForm
        form={groupForm}
        isEditing={editingGroupIndex !== null}
        onSubmit={onSubmitGroup}
        onCancel={handleCancelGroupEdit}
      />
    )
  return (
    <>
      {isMobile ? (
        <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DrawerTrigger asChild>
            <CourseFormTrigger isEditing={isEditingCourse} />
          </DrawerTrigger>
          <DrawerContent>{content}</DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <CourseFormTrigger isEditing={isEditingCourse} />
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">{content}</DialogContent>
        </Dialog>
      )}
    </>
  )
}
