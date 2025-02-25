import Schedule from '../components/Schedule'
import useCourseStore from '../stores/useCourseStore'

const Home = () => {
  const { courses } = useCourseStore()

  return (
    <div>
      <h1 className='text-2xl font-bold text-center p-2'>Home</h1>
      <pre>{JSON.stringify(courses, null, 2)}</pre>
      <Schedule />
    </div>
  )
}

export default Home
