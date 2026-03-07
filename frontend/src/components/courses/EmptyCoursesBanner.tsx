import { BookOpen } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'
import { EmptyState } from '@/components/shared'
import CourseForm from './courseForm/CourseForm'

export function EmptyCoursesBanner() {
  const { t } = useI18n('courses')

  return (
    <EmptyState
      icon={BookOpen}
      title={t('emptyState.title')}
      description={t('emptyState.description')}
      className="min-h-[60vh]"
    >
      <CourseForm variant="prominent" />
    </EmptyState>
  )
}

