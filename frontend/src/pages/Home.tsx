import Schedule from '@/components/Schedule'
import useCourseStore from '@/stores/useCourseStore'
import { useGenerateSchedule } from '@/hooks/useGenerateSchedule'
import { Button } from '@/components/ui/button'

const Home = () => {
  const { generateSchedule, isLoading, error, scheduleData, isSuccess } =
    useGenerateSchedule()
  const { courses } = useCourseStore()

  return (
    <>
      <div>
        <Button onClick={() => generateSchedule()} disabled={isLoading}>
          {isLoading ? 'Generando...' : 'Generar Horario'}
        </Button>

        {error && <p className='error'>Error: {error.message}</p>}

        {isSuccess && (
          <div>
            <pre>{JSON.stringify(scheduleData, null, 2)}</pre>
          </div>
        )}
      </div>
      <pre>{JSON.stringify(courses, null, 2)}</pre>
      <Schedule />
    </>
  )
}

export default Home
