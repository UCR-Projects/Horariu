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

      // Use pure black/white to match new theme
      const backgroundColor = isDarkMode ? '#000000' : '#ffffff'

      return await html2canvas(tableRef.current, {
        scale: 2,
        backgroundColor,
        useCORS: true,
        logging: false,
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

    // Determine orientation based on canvas aspect ratio
    const isLandscape = canvas.width > canvas.height
    const orientation = isLandscape ? 'l' : 'p'

    // A4 dimensions in mm
    const a4Width = isLandscape ? 297 : 210
    const a4Height = isLandscape ? 210 : 297

    // Calculate image dimensions with margins
    const margin = 10 // 10mm margins
    const maxWidth = a4Width - (margin * 2)
    const maxHeight = a4Height - (margin * 2)

    // Scale image to fit within margins while maintaining aspect ratio
    const aspectRatio = canvas.width / canvas.height
    let imgWidth = maxWidth
    let imgHeight = imgWidth / aspectRatio

    // If height exceeds max, scale by height instead
    if (imgHeight > maxHeight) {
      imgHeight = maxHeight
      imgWidth = imgHeight * aspectRatio
    }

    // Center the image
    const xOffset = (a4Width - imgWidth) / 2
    const yOffset = (a4Height - imgHeight) / 2

    const pdf = new jsPDF(orientation, 'mm', 'a4')
    pdf.addImage(image, 'PNG', xOffset, yOffset, imgWidth, imgHeight)
    pdf.save(`schedule-option-${scheduleIndex + 1}.pdf`)
  }, [generateCanvas, scheduleIndex])

  return {
    exportAsImage,
    exportAsPDF,
  }
}
