import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Database, Trash2, ChevronDown } from 'lucide-react'
import useCourseStore from '@/stores/useCourseStore'
import { SampleCoursesSetType } from '@/mocks/sampleCourses'
import { datasets } from '@/mocks/sampleCourses'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const LoadSampleDataButtons = () => {
  const loadSampleData = useCourseStore((state) => state.loadSampleData)
  const clearAllCourses = useCourseStore((state) => state.clearAllCourses)
  const [selectedDataset, setSelectedDataset] = useState<SampleCoursesSetType>('single')

  const handleLoadData = () => {
    loadSampleData(selectedDataset)
  }

  if (!import.meta.env.DEV) return null

  return (
    <div className="flex flex-col sm:flex-row gap-2 p-3 dark:bg-neutral-900/30 rounded-md mb-4">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <span className="text-sm font-medium">Load Sample Courses:</span>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-between gap-1"
              >
                {datasets.find((d) => d.value === selectedDataset)?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {datasets.map((dataset) => (
                <DropdownMenuItem
                  key={dataset.value}
                  onClick={() => setSelectedDataset(dataset.value as SampleCoursesSetType)}
                >
                  {dataset.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="default"
            size="sm"
            onClick={handleLoadData}
            className="flex items-center gap-1"
          >
            <Database className="h-4 w-4" />
            Load Courses
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={clearAllCourses}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Clear Courses
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LoadSampleDataButtons
