//import { useState } from 'react'


const generateTimeRanges = () => {
  const ranges = []
  let hour = 7
  let minute = 0

  while (hour < 23 || (hour === 22 && minute <= 50)) {
    const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    minute += 50
    if (minute >= 60) {
      hour += 1
      minute -= 60
    }
    const endTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    ranges.push(`${startTime} - ${endTime}`)
  }
  return ranges
}


const Schedule = () => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
  const hours = generateTimeRanges()

  // const [selectedCells, setSelectedCells] = useState(new Map())



  // const handleCellClick = (hour, day) => {
  //   const key = `${hour}-${day}`
  //   const newSelected = new Map(selectedCells)
    
  //   if (selectedCells.has(key)) {
  //     newSelected.delete(key)
  //   } else {
  //     newSelected.set(key, { hour, day })
  //   }
    
  //   setSelectedCells(newSelected)
  // }

  // const isCellSelected = (hour, day) => {
  //   return selectedCells.has(`${hour}-${day}`)
  // }



  return (
    <div>
      <table className=''>
        <thead>
          <tr>
            <th className="p-1 border border-gray-300">Hora</th>

            {days.map((day, index) => (
              <th key={index} className="p-2 border border-gray-300">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map(hour => (
            <tr key={hour}>
              <td className="p-1 border border-gray-300 text-center">
                {hour}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Schedule