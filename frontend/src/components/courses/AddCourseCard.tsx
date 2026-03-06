import { Card, CardContent } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'
import CourseForm from './courseForm/CourseForm'

export function AddCourseCard() {
  const { t } = useI18n('courses')

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full bg-background/30 border-border/40 shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="mb-6">
            <div className="rounded-2xl bg-muted/50 p-5">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-3">
            {t('emptyState.title')}
          </h3>

          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            {t('emptyState.description')}
          </p>

          <CourseForm variant="prominent" />
        </CardContent>
      </Card>
    </div>
  )
}

