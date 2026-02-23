import useCourseStore from '@/stores/useCourseStore'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ClearCoursesButton } from './ClearCoursesButton'
import { tokens } from '@/styles'

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
          className={`${tokens.interactive.md} p-0 bg-card hover:bg-interactive-hover cursor-pointer`}
        >
          <MoreVertical className={tokens.icon.sm} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card">
        <ClearCoursesButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
