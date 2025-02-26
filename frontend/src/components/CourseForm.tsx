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
    isValid,
    setSelectedGroup,
    updateFormField,
    addGroup,
    deleteGroup,
    toggleGroupDay,
    updateGroupSchedule,
    handleSubmit,
  } = useCourseForm()

  const handleCancel = () => {
    if (onCancel) onCancel()
    setEditMode(false)
  }

  return (
    <div className='mb-4 p-4 bg-zinc-900 rounded-lg'>
      <h2 className='text-lg text-center font-medium mb-3'>
        {isEditMode ? t('editCourse') : t('createNewCourse')}
      </h2>

      <div className='mb-2'>
        <input
          className='bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700 mb-2 w-full'
          type='text'
          placeholder={t('courseName')}
          value={formData.name}
          onChange={(e) => updateFormField('name', e.target.value)}
        />
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

        <GroupFormSection
          groups={formData.groups}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          onDeleteGroup={deleteGroup}
          onToggleDay={toggleGroupDay}
          onUpdateSchedule={updateGroupSchedule}
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
            className='bg-green-600 hover:bg-green-700 text-white py-2 rounded flex-1'
            onClick={handleSubmit}
            disabled={!isValid}
          >
            {t('saveChanges')}
          </button>
        </div>
      ) : (
        <button
          type='button'
          className='border-zinc-300 border-1 hover:bg-zinc-800 text-white py-2 rounded w-full'
          onClick={handleSubmit}
          disabled={!isValid}
        >
          {t('addCourse')}
        </button>
      )}
    </div>
  )
}

export default CourseForm
