import useCourseStore from '@/stores/useCourseStore'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ClearCoursesButton } from './ClearCoursesButton'

export function CoursesListOptions() {
  const courses = useCourseStore((state) => state.courses)

  if (!courses || courses.length < 2) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-neutral-50 dark:bg-neutral-900">
        <ClearCoursesButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
