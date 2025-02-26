import { useTranslation } from 'react-i18next'
import CourseForm from './CourseForm'
import CourseList from './CourseList'
import { useCourseSelection } from '../hooks/useCourseSelection'

const Panel = () => {
  const { t } = useTranslation()
  const courseSelectionProps = useCourseSelection()

  return (
    <div className='w-full max-w-md text-zinc-300 p-2 flex flex-col'>
      <CourseForm onCancel={() => courseSelectionProps.onSelectCourse(null)} />

      <div className='mt-2 flex-1 overflow-y-auto'>
        <h2 className='text-lg font-medium'>{t('courses')}</h2>
        <CourseList {...courseSelectionProps} />
      </div>
    </div>
  )
}

export default Panel
