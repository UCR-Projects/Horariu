import Schedule from '@/components/Schedule'
import { useGenerateSchedule } from '@/hooks/useGenerateSchedule'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect } from 'react'

const Home = () => {
  const { generateSchedule, isLoading, isSuccess, error } =
    useGenerateSchedule()

  useEffect(() => {
    if (isSuccess) {
      toast.success('Schedule generated successfully', {
        className: 'bg-green-500 text-white border border-green-600',
      })
    }
  }, [isSuccess])

  useEffect(() => {
    if (error) {
      toast.error('Error generating schedule')
    }
  }, [error])
  return (
    <>
      <div>
        <Button onClick={() => generateSchedule()} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Generating...
            </>
          ) : (
            'Generate Schedule'
          )}
        </Button>
      </div>
      <Schedule />
    </>
  )
}

export default Home
