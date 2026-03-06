import { Button } from '@/components/ui/button'
import { forwardRef, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSidebar } from '@/components/ui/sidebar'
import { Edit2, Plus } from 'lucide-react'
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
  variant?: 'default' | 'prominent'
}

interface CourseFormTriggerProps {
  isEditing: boolean
  variant?: 'default' | 'prominent'
}

const CourseFormTrigger = forwardRef<HTMLButtonElement, CourseFormTriggerProps>(
  ({ isEditing, variant = 'default', ...props }, ref) => {
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

    if (variant === 'prominent') {
      return (
        <Button ref={ref} size="lg" className="cursor-pointer gap-2" {...props}>
          <Plus className="h-4 w-4" />
          {t('addFirstCourse')}
        </Button>
      )
    }

    return (
      <Button ref={ref} className="cursor-pointer gap-2" {...props}>
        <Plus className="h-4 w-4" />
        {t('addCourse')}
      </Button>
    )
  }
)

export default function CourseForm({ existingCourse, variant = 'default' }: CourseFormProps) {
  const isMobile = useIsMobile()
  const { setOpenMobile } = useSidebar()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeStep, setActiveStep] = useState<'course' | 'group'>('course')

  const handleSuccess = () => {
    setIsDialogOpen(false)
    // Open sidebar automatically on mobile after adding a course
    if (isMobile) {
      setOpenMobile(true)
    }
  }

  // Course form management
  const { courseForm, currentGroups, currentGroupNames, isEditingCourse, onSubmitCourse } =
    useCourseFormManager({
      existingCourse,
      isDialogOpen,
      onSuccess: handleSuccess,
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
            <CourseFormTrigger isEditing={isEditingCourse} variant={variant} />
          </DrawerTrigger>
          <DrawerContent>{content}</DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <CourseFormTrigger isEditing={isEditingCourse} variant={variant} />
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">{content}</DialogContent>
        </Dialog>
      )}
    </>
  )
}
