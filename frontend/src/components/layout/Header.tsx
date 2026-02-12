import ThemeToggle from './ThemeToggle'

export function Header() {
  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold p-4">HorariU</h1>
        <div className="flex items-center gap-4 mr-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
