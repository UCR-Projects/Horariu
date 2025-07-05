import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: CustomPaginationProps) => {
  const getVisiblePages = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate range around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      // Add ellipsis if there's a gap after first page
      if (start > 2) {
        pages.push('...')
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }

      // Add ellipsis if there's a gap before last page
      if (end < totalPages - 1) {
        pages.push('...')
      }

      // Always show last page if it's not the first page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className='flex items-center justify-center space-x-1'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='h-8 w-8 p-0 cursor-pointer dark:hover:bg-neutral-900 hover:bg-neutral-200/50'
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>

      {visiblePages.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <div className='flex items-center justify-center h-8 w-8'>
              <MoreHorizontal className='h-4 w-4' />
            </div>
          ) : (
            <Button
              variant={currentPage === page ? 'default' : 'outline'}
              size='sm'
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`h-8 w-8 p-0 cursor-pointer ${
                currentPage === page
                  ? '' // No additional styles for active page
                  : 'dark:hover:bg-neutral-900 hover:bg-neutral-200/50'
              }`}
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='h-8 w-8 p-0 cursor-pointer dark:hover:bg-neutral-900 hover:bg-neutral-200/50'
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  )
}

export default CustomPagination
