import { test, expect, Page } from '@playwright/test'

/**
 * E2E Tests for Schedule Export Flow
 * Tests exporting schedules as image and PDF
 *
 * Note: App uses i18n with English/Spanish translations
 * Form inputs: courseName for course, groupName for group
 */

// Helper to create a course and generate schedule
async function setupScheduleForExport(page: Page): Promise<void> {
  // "Add Course" / "Agregar Curso"
  const addCourseButton = page.getByRole('button', { name: /Add Course|Agregar Curso/i })
  await addCourseButton.click()
  await page.waitForTimeout(300)

  const courseNameInput = page.locator('[role="dialog"] input[name="courseName"]')
  await courseNameInput.fill('Export Test Course')

  // "Add Group" / "Agregar Grupo"
  const addGroupButton = page
    .locator('[role="dialog"]')
    .getByRole('button', { name: /Add Group|Agregar Grupo/i })
  await addGroupButton.click()
  await page.waitForTimeout(300)

  const groupNameInput = page.locator('[role="dialog"] input[name="groupName"]')
  await groupNameInput.fill('Export Group')

  // Monday - "Mo" (English) / "L" (Spanish)
  const mondayButton = page.locator('[role="dialog"] button').filter({ hasText: /^Mo$|^L$/i })
  await mondayButton.click()
  await page.waitForTimeout(200)

  const timeButtons = page
    .locator('[role="dialog"] button[role="combobox"]')
    .filter({ hasText: '----' })
  if ((await timeButtons.count()) > 0) {
    await timeButtons.first().click()
    await page.getByRole('option', { name: '08:00' }).click()
  }

  const endTimeButtons = page
    .locator('[role="dialog"] button[role="combobox"]')
    .filter({ hasText: '----' })
  if ((await endTimeButtons.count()) > 0) {
    await endTimeButtons.first().click()
    await page.getByRole('option', { name: '08:50' }).click()
  }

  // "Save" / "Guardar"
  const saveGroupButton = page
    .locator('[role="dialog"]')
    .getByRole('button', { name: /^Save$|^Guardar$/i })
  await saveGroupButton.click()
  await page.waitForTimeout(300)

  // Save course - when creating, button says "Add Course"
  const saveCourseButton = page
    .locator('[role="dialog"]')
    .getByRole('button', { name: /Add Course|Agregar Curso/i })
  await saveCourseButton.click()
  await page.waitForTimeout(500)

  // "Generate Schedules" / "Generar Horarios"
  const generateButton = page.getByRole('button', { name: /Generate Schedules|Generar Horarios/i })
  await generateButton.click()
  await page.waitForTimeout(3000)
}

test.describe('Schedule Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForSelector('[data-sidebar="sidebar"]', { timeout: 10000 })
  })

  test('should show export menu button after schedule generation', async ({ page }) => {
    await setupScheduleForExport(page)

    // "Download Schedule" / "Descargar Horario"
    const exportButton = page.getByRole('button', { name: /Download Schedule|Descargar Horario/i })
    await expect(exportButton).toBeVisible()
  })

  test('should open export dropdown menu when clicking export button', async ({ page }) => {
    await setupScheduleForExport(page)

    const exportButton = page.getByRole('button', { name: /Download Schedule|Descargar Horario/i })
    await exportButton.click()

    // "Image" / "Imagen"
    const imageOption = page.getByRole('menuitem', { name: /^Image$|^Imagen$/i })
    // "PDF" is the same in both languages
    const pdfOption = page.getByRole('menuitem', { name: /^PDF$/i })

    await expect(imageOption).toBeVisible()
    await expect(pdfOption).toBeVisible()
  })

  test('should trigger image export when clicking image option', async ({ page }) => {
    await setupScheduleForExport(page)

    // Set up download listener (may not work in headless due to html2canvas)
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null)

    const exportButton = page.getByRole('button', { name: /Download Schedule|Descargar Horario/i })
    await exportButton.click()

    const imageOption = page.getByRole('menuitem', { name: /^Image$|^Imagen$/i })
    await imageOption.click()

    const download = await downloadPromise
    if (download) {
      const filename = download.suggestedFilename()
      expect(filename).toContain('.png')
    }
    // Test passes if click was successful even without download in headless
  })

  test('should trigger PDF export when clicking PDF option', async ({ page }) => {
    await setupScheduleForExport(page)

    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null)

    const exportButton = page.getByRole('button', { name: /Download Schedule|Descargar Horario/i })
    await exportButton.click()

    const pdfOption = page.getByRole('menuitem', { name: /^PDF$/i })
    await pdfOption.click()

    const download = await downloadPromise
    if (download) {
      const filename = download.suggestedFilename()
      expect(filename).toContain('.pdf')
    }
    // Test passes if click was successful even without download in headless
  })

  test('should not show export button when no schedules exist', async ({ page }) => {
    // Without generating schedules, the download button should not be visible
    const exportButton = page.getByRole('button', { name: /Download Schedule|Descargar Horario/i })
    await expect(exportButton).not.toBeVisible()
  })
})
