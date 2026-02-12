import { Button } from '@/components/ui/button'
import { UseFormReturn } from 'react-hook-form'
import { CourseFormValuesType } from '@/validation/schemas/course.schema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/hooks/useI18n'
import { GroupsList } from './GroupsList'
import { ColorPicker, ResponsiveFormWrapper } from '@/components/shared'

interface CourseFormProps {
  form: UseFormReturn<CourseFormValuesType>
  isEditingCourse: boolean
  groups: CourseFormValuesType['groups']
  onToggleGroupVisibility: (index: number) => void
  onSubmit: (values: CourseFormValuesType) => void
  onAddGroup: () => void
  onEditGroup: (index: number) => void
  onDeleteGroup: (index: number) => void
  onCancel: () => void
}

export function CourseInputsForm({
  form,
  isEditingCourse,
  groups,
  onSubmit,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
  onCancel,
  onToggleGroupVisibility,
}: CourseFormProps) {
  const { t } = useI18n(['common', 'courses'])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit(onSubmit)(e)
  }

  const formContent = (
    <Form {...form}>
      <form
        id="courseForm"
        onSubmit={handleFormSubmit}
        className="space-y-4 overflow-y-auto max-h-[70vh]"
      >
        <FormField
          control={form.control}
          name="courseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">{t('courses:courseName')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('courses:courseName')}
                  {...field}
                  className="text-sm py-2"
                  maxLength={30}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <ColorPicker
                colorValue={field.value}
                onColorChange={(color) => field.onChange(color)}
              />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormLabel className="text-sm">{t('courses:group')}s</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs px-2 py-1 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800"
            onClick={onAddGroup}
          >
            {t('courses:addGroup')}
          </Button>
        </div>

        {form.formState.errors.groups?.message && (
          <div className="text-red-500 text-sm">{form.formState.errors.groups?.message}</div>
        )}

        <GroupsList
          groups={groups}
          onEditGroup={onEditGroup}
          onDeleteGroup={onDeleteGroup}
          onToggleGroupVisibility={onToggleGroupVisibility}
        />
      </form>
    </Form>
  )

  const footerButtons = (
    <div className="flex justify-between space-x-3">
      {isEditingCourse && (
        <Button type="button" variant="outline" className="cursor-pointer" onClick={onCancel}>
          {t('common:actions.cancel')}
        </Button>
      )}
      <Button type="submit" form="courseForm" className="cursor-pointer">
        {isEditingCourse ? t('common:actions.save') : t('courses:addCourse')}
      </Button>
    </div>
  )

  return (
    <ResponsiveFormWrapper
      title={isEditingCourse ? t('courses:editCourse') : t('courses:newCourse')}
      description={isEditingCourse ? t('courses:editCourseDes') : t('courses:courseFormDes')}
      footer={footerButtons}
    >
      {formContent}
    </ResponsiveFormWrapper>
  )
}
