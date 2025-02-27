import { useTranslation } from 'react-i18next'
import { useCourseForm } from '../hooks/useCourseForm'
import useCourseStore from '../stores/useCourseStore'
import ColorSelector from './ColorSelector'
import GroupFormSection from './GroupFormSection'

interface CourseFormProps {
  onCancel?: () => void
}

const CourseForm = ({ onCancel }: CourseFormProps) => {
  const { t } = useTranslation()
  const { isEditMode, setEditMode } = useCourseStore()

  const {
    formData,
    selectedGroup,
    errors,
    setSelectedGroup,
    updateFormField,
    addGroup,
    deleteGroup,
    toggleGroupDay,
    updateGroupSchedule,
    handleSubmit,
    validateForm,
  } = useCourseForm()

  const handleCancel = () => {
    if (onCancel) onCancel()
    setEditMode(false)
  }

  const onSubmit = () => {
    if (validateForm()) {
      handleSubmit()
    }
  }

  return (
    <div className='mb-4 p-4 bg-zinc-900 rounded-lg'>
      <h2 className='text-lg text-center font-medium mb-3'>
        {isEditMode ? t('editCourse') : t('createNewCourse')}
      </h2>

      <div className='mb-2'>
        <input
          className={`bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700 mb-1 w-full ${
            errors.name ? 'border border-red-500' : ''
          }`}
          type='text'
          placeholder={t('courseName')}
          value={formData.name}
          onChange={(e) => updateFormField('name', e.target.value)}
        />
        {errors.name && (
          <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
        )}
      </div>

      <div className='mb-4'>
        <div className='flex space-x-2 mb-2'>
          <div className='grid grid-cols-2 gap-2 w-full'>
            <ColorSelector
              currentColor={formData.color}
              setCurrentColor={(color) => updateFormField('color', color)}
            />
            <button
              type='button'
              className='bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-md flex items-center justify-center'
              onClick={addGroup}
            >
              + {t('addGroup')}
            </button>
          </div>
        </div>

        {errors.groups && (
          <p className='text-red-500 text-xs mb-2'>{errors.groups}</p>
        )}

        <GroupFormSection
          groups={formData.groups}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          onDeleteGroup={deleteGroup}
          onToggleDay={toggleGroupDay}
          onUpdateSchedule={updateGroupSchedule}
          errors={errors.groupSchedules}
        />
      </div>

      {isEditMode ? (
        <div className='flex space-x-2'>
          <button
            type='button'
            className='bg-zinc-700 hover:bg-zinc-600 py-2 rounded flex-1'
            onClick={handleCancel}
          >
            {t('cancel')}
          </button>
          <button
            type='button'
            className='bg-green-600 hover:bg-green-700 text-white py-2 rounded flex-1 disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={onSubmit}
          >
            {t('saveChanges')}
          </button>
        </div>
      ) : (
        <button
          type='button'
          className='border-zinc-300 border-1 hover:bg-zinc-800 text-white py-2 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={onSubmit}
        >
          {t('addCourse')}
        </button>
      )}
    </div>
  )
}

export default CourseForm
