import { BookOpen } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { LanguageToggleButton } from './LanguageToggle'
import { InfoButton } from './InfoButton'
import useCourseStore from '@/stores/useCourseStore'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function Header() {
  const courses = useCourseStore((state) => state.courses)
  const totalCourses = courses.length
  const totalGroups = courses.reduce((acc, course) => acc + course.groups.length, 0)

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="flex justify-between items-center px-4 py-3">
        {/* Logo and stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">HorariU</h1>
          </div>

          {/* Progress indicator - only show when there are courses */}
          {totalCourses > 0 && (
            <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-4 w-px bg-border" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 cursor-default">
                    <div className="flex gap-1">
                      {[...Array(Math.min(totalCourses, 5))].map((_, i) => (
                        <div
                          key={i}
                          className="h-2 w-2 rounded-full bg-primary"
                        />
                      ))}
                      {totalCourses > 5 && (
                        <span className="text-xs ml-1">+{totalCourses - 5}</span>
                      )}
                    </div>
                    <span className="text-xs">
                      {totalCourses} {totalCourses === 1 ? 'course' : 'courses'}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{totalCourses} courses, {totalGroups} groups</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Actions - consolidated on the right */}
        <div className="flex items-center gap-1">
          <LanguageToggleButton />
          <ThemeToggle />
          <InfoButton />
        </div>
      </div>
    </header>
  )
}
