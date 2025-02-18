import { useScheduleStore } from '../stores/useScheduleStore'

const Aside = () => {
  const { selectedCells, clearCells } = useScheduleStore()

  return (
    <div>
      <h1 className="text-2xl font-bold text-center p-2">Aside</h1>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Celdas seleccionadas:</h2>
        {selectedCells.size === 0 ? (
          <p>No hay celdas seleccionadas.</p>
        ) : (
          <ul>
            {Array.from(selectedCells.entries()).map(([key, { hour, day }]) => (
              <li key={key} className="mb-2">
                <span className="font-medium">Día:</span> {day}, <span className="font-medium">Hora:</span> {hour}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-4 flex justify-center">
        <button
          className=" bg-red-500 text-white font-semibold p-2 rounded-md "
          onClick={clearCells}
        >
          Limpiar celdas
        </button>
      </div>
    </div>
  )
}

export default Aside