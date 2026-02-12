import { useCallback, RefObject } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas-pro'
import { useTheme } from '@/components/layout'

interface UseScheduleExportOptions {
  tableRef: RefObject<HTMLTableElement | null>
  scheduleIndex: number
}

interface UseScheduleExportReturn {
  exportAsImage: () => Promise<void>
  exportAsPDF: () => Promise<void>
}

/**
 * Hook for exporting schedule tables as images or PDFs.
 * Handles canvas generation with proper theme support.
 */
export function useScheduleExport({
  tableRef,
  scheduleIndex,
}: UseScheduleExportOptions): UseScheduleExportReturn {
  const { theme } = useTheme()

  const generateCanvas = useCallback(async () => {
    if (!tableRef.current) return null

    try {
      const isDarkMode =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

      return await html2canvas(tableRef.current, {
        scale: 2,
        backgroundColor: isDarkMode ? '#262626' : '#ffffff',
      })
    } catch (error) {
      console.error('generating canvas:', error)
      return null
    }
  }, [tableRef, theme])

  const exportAsImage = useCallback(async () => {
    const canvas = await generateCanvas()
    if (!canvas) return

    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = `schedule-option-${scheduleIndex + 1}.png`
    link.click()
  }, [generateCanvas, scheduleIndex])

  const exportAsPDF = useCallback(async () => {
    const canvas = await generateCanvas()
    if (!canvas) return

    const image = canvas.toDataURL('image/png')
    const imgWidth = 210 // A4 width in mm (portrait)
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    const pdf = new jsPDF('p', 'mm', 'a4')
    pdf.addImage(image, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`schedule-option-${scheduleIndex + 1}.pdf`)
  }, [generateCanvas, scheduleIndex])

  return {
    exportAsImage,
    exportAsPDF,
  }
}
