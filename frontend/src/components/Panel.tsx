import { useState } from 'react'
import useCourseStore from '../stores/useCourseStore'


const Panel = () => {
  const [courseName, setCourseName] = useState('')
  const { 
    courses,  
    currentColor,
    setCurrentColor,
    addCourse, 
    deleteCourse,

  } = useCourseStore()


  const handleAddCourse = () => {
    if (courseName.trim()) { 
      addCourse(courseName)
      setCourseName('')
    }
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre del curso"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        
        <div className="">
          <span> Color </span>
          <input 
            type="color" 
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
          />
        </div>
      </div>

      <button className='bg-blue-600 hover:bg-blue-500 text-white py-2 rounded' onClick={handleAddCourse}>Agregar curso</button>

      <div>
        {courses.map(course => (
          <div key={course.name} className="flex justify-between items-center p-2 border-b">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: course.color }}></div>
              <span className="ml-2">{course.name}</span>
            </div>

            <button onClick={() => deleteCourse(course.name)}>🗑️</button>
          
            <div className="text-sm text-gray-400 mt-1">
              Grupos: {course.groups.length}
            </div>
          
          </div>

        ))}

      </div>


    </div>
  )
}

export default Panel