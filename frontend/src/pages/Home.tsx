import Schedule from '@/components/Schedule'
import useCourseStore from '@/stores/useCourseStore'

const Home = () => {
  const { courses } = useCourseStore()

  return (
    <>
      <pre>{JSON.stringify(courses, null, 2)}</pre>
      <Schedule />
    </>
  )
}

export default Home
