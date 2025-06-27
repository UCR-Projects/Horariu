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
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

import ColorPicker from '@/components/ColorPicker'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/hooks/use-mobile'
import { GroupsList } from '@/components/courseForm/GroupsList'

interface CourseFormProps {
  form: UseFormReturn<CourseFormValuesType>
  isEditingCourse: boolean
  groups: CourseFormValuesType['groups']
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
}: CourseFormProps) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit(onSubmit)(e)
  }

  const formContent = (
    <Form {...form}>
      <form
        id='courseForm'
        onSubmit={handleFormSubmit}
        className='space-y-4 overflow-y-auto max-h-[70vh]'
      >
        <FormField
          control={form.control}
          name='courseName'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm'>{t('courseName')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('courseName')}
                  {...field}
                  className='text-sm py-2'
                  maxLength={30}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='color'
          render={({ field }) => (
            <FormItem>
              <ColorPicker
                colorValue={field.value}
                onColorChange={(color) => field.onChange(color)}
              />
            </FormItem>
          )}
        />

        <div className='flex items-center justify-between'>
          <FormLabel className='text-sm'>{t('group')}s</FormLabel>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='text-xs px-2 py-1 cursor-pointer'
            onClick={onAddGroup}
          >
            {t('addGroup')}
          </Button>
        </div>

        {form.formState.errors.groups?.message && (
          <div className='text-red-500 text-sm'>
            {form.formState.errors.groups?.message}
          </div>
        )}

        <GroupsList
          groups={groups}
          onEditGroup={onEditGroup}
          onDeleteGroup={onDeleteGroup}
        />
      </form>
    </Form>
  )

  const footerButtons = (
    <div className='flex justify-between space-x-3'>
      {isEditingCourse && (
        <Button
          type='button'
          variant='outline'
          className='cursor-pointer'
          onClick={onCancel}
        >
          {t('cancel')}
        </Button>
      )}
      <Button type='submit' form='courseForm' className='cursor-pointer'>
        {isEditingCourse ? t('save') : t('addCourse')}
      </Button>
    </div>
  )

  return (
    <>
      {isMobile ? (
        <>
          <DrawerHeader className='p-0'>
            <DrawerTitle className='text-lg'>
              {isEditingCourse ? t('editCourse') : t('newCourse')}
            </DrawerTitle>
            <DrawerDescription className='text-sm'>
              {isEditingCourse ? t('editCourseDes') : t('courseFormDes')}
            </DrawerDescription>
          </DrawerHeader>
          {formContent}

          <DrawerFooter className='p-0'>{footerButtons}</DrawerFooter>
        </>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle className='text-lg'>
              {isEditingCourse ? t('editCourse') : t('newCourse')}
            </DialogTitle>
            <DialogDescription className='text-sm'>
              {isEditingCourse ? t('editCourseDes') : t('courseFormDes')}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-2'>
            {formContent}
            <DialogFooter>{footerButtons}</DialogFooter>
          </div>
        </>
      )}
    </>
  )
}
