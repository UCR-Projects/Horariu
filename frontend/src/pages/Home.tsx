import Schedule from '../components/Schedule'
import useCourseStore from '../stores/useCourseStore'

const Home = () => {
  const { courses } = useCourseStore()

  return (
    <div>
      <pre>{JSON.stringify(courses, null, 2)}</pre>
      sadasdasdas
      <Schedule />
      sad sad sad as d sad
    </div>
  )
}

export default Home
