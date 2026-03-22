import { test, expect, Page } from '@playwright/test'

/**
 * E2E Tests for Schedule Generation Flow
 * Tests generating schedules from courses and viewing results
 *
 * Note: App uses i18n with English/Spanish translations
 * Form inputs: courseName for course, groupName for group
 */

// Mock API response for schedule generation
async function mockScheduleApi(page: Page): Promise<void> {
  // Mock all possible API endpoints (local, dev, prod)
  await page.route('**/courses/generate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: '1 schedule(s) found',
        schedules: [
          [
            {
              courseName: 'Programming 101',
              group: {
                name: 'Section A',
                schedule: { L: [{ start: '08:00', end: '08:50' }] }
              }
            }
          ]
        ]
      })
    })
  })
}

test.describe('Schedule Generation', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mock - must be done before ANY navigation
    await mockScheduleApi(page)

    await page.goto('/')
    // Clear storage and mark onboarding as completed
    await page.evaluate(() => {
      localStorage.clear()
      localStorage.setItem('horariu-onboarding', JSON.stringify({
        state: { hasCompletedOnboarding: true, currentStep: 0 },
        version: 0
      }))
    })
    // Set up mock again before reload (route handlers persist across navigations but need to be set before)
    await mockScheduleApi(page)
    await page.reload()
    await page.waitForSelector('[data-sidebar="sidebar"]', { timeout: 10000 })
  })

  test('should not show generate button when no courses exist', async ({ page }) => {
    // When no courses exist, the Generate button is not rendered at all
    // The UI shows AddCourseCard instead
    const generateButton = page.getByRole('button', {
      name: /Generate Schedules|Generar Horarios/i,
    })
    await expect(generateButton).not.toBeVisible()
  })

  test('should enable generate button when course with active group exists', async ({ page }) => {
    // In empty state: "Add my first course" / "Agregar mi primer curso"
    const addCourseButton = page.getByRole('button', { name: /Add.*course|Agregar.*curso/i })
    await addCourseButton.click()
    await page.waitForTimeout(300)

    const courseNameInput = page.locator('[role="dialog"] input[name="courseName"]')
    await courseNameInput.fill('Test Course')

    const addGroupButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /Add Group|Agregar Grupo/i })
    await addGroupButton.click()
    await page.waitForTimeout(300)

    const groupNameInput = page.locator('[role="dialog"] input[name="groupName"]')
    await groupNameInput.fill('Group 1')

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

    const saveGroupButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /^Save$|^Guardar$/i })
    await saveGroupButton.click()
    await page.waitForTimeout(300)

    const saveCourseButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /Add Course|Agregar Curso/i })
    await saveCourseButton.click()
    await page.waitForTimeout(500)

    const generateButton = page.getByRole('button', {
      name: /Generate Schedules|Generar Horarios/i,
    })
    await expect(generateButton).toBeEnabled()
  })

  test('should show empty state message when no courses exist', async ({ page }) => {
    // When no courses exist, shows courses empty state card
    // "Generate all your schedule options" / "Genera todas tus opciones de horario"
    const emptyStateTitle = page.getByText(/Generate all your schedule options|Genera todas tus opciones de horario/i)
    await expect(emptyStateTitle).toBeVisible()

    // Check description is also visible
    // "Add your courses with their groups" / "Agrega tus cursos con sus grupos"
    const emptyStateDescription = page.getByText(/Add your courses|Agrega tus cursos/i)
    await expect(emptyStateDescription).toBeVisible()
  })

  test('should generate and display schedule after clicking generate button', async ({ page }) => {
    // In empty state: "Add my first course" / "Agregar mi primer curso"
    const addCourseButton = page.getByRole('button', { name: /Add.*course|Agregar.*curso/i })
    await addCourseButton.click()
    await page.waitForTimeout(300)

    const courseNameInput = page.locator('[role="dialog"] input[name="courseName"]')
    await courseNameInput.fill('Programming 101')

    const addGroupButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /Add Group|Agregar Grupo/i })
    await addGroupButton.click()
    await page.waitForTimeout(300)

    const groupNameInput = page.locator('[role="dialog"] input[name="groupName"]')
    await groupNameInput.fill('Section A')

    // Monday - "Mo" (English) / "L" (Spanish)
    const mondayButton = page.locator('[role="dialog"] button').filter({ hasText: /^Mo$|^L$/i })
    await mondayButton.click()
    await page.waitForTimeout(200)

    const timeButtons = page
      .locator('[role="dialog"] button[role="combobox"]')
      .filter({ hasText: '----' })
    if ((await timeButtons.count()) > 0) {
      await timeButtons.first().click()
      await page.getByRole('option', { name: '10:00' }).click()
    }

    const endTimeButtons = page
      .locator('[role="dialog"] button[role="combobox"]')
      .filter({ hasText: '----' })
    if ((await endTimeButtons.count()) > 0) {
      await endTimeButtons.first().click()
      await page.getByRole('option', { name: '10:50' }).click()
    }

    const saveGroupButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /^Save$|^Guardar$/i })
    await saveGroupButton.click()
    await page.waitForTimeout(300)

    const saveCourseButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /Add Course|Agregar Curso/i })
    await saveCourseButton.click()
    await page.waitForTimeout(500)

    const generateButton = page.getByRole('button', {
      name: /Generate Schedules|Generar Horarios/i,
    })

    // Click generate and wait for API response
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/generate')),
      generateButton.click()
    ])

    // Verify mock returned successfully
    expect(response.status()).toBe(200)

    // Wait for UI to update
    await page.waitForTimeout(500)

    // "Option" / "Opcion"
    const scheduleOption = page.getByText(/^Option|^Opci[oó]n/i)
    await expect(scheduleOption.first()).toBeVisible()

    // Verify course appears in schedule table
    const courseInSchedule = page.locator('table').getByText('Programming 101')
    await expect(courseInSchedule.first()).toBeVisible()
  })

  test('should show schedule count badge after generation', async ({ page }) => {
    // In empty state: "Add my first course" / "Agregar mi primer curso"
    const addCourseButton = page.getByRole('button', { name: /Add.*course|Agregar.*curso/i })
    await addCourseButton.click()
    await page.waitForTimeout(300)

    const courseNameInput = page.locator('[role="dialog"] input[name="courseName"]')
    await courseNameInput.fill('Quick Course')

    const addGroupButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /Add Group|Agregar Grupo/i })
    await addGroupButton.click()
    await page.waitForTimeout(300)

    const groupNameInput = page.locator('[role="dialog"] input[name="groupName"]')
    await groupNameInput.fill('G1')

    // Friday - "Fr" (English) / "V" (Spanish)
    const fridayButton = page.locator('[role="dialog"] button').filter({ hasText: /^Fr$|^V$/i })
    await fridayButton.click()
    await page.waitForTimeout(200)

    const timeButtons = page
      .locator('[role="dialog"] button[role="combobox"]')
      .filter({ hasText: '----' })
    if ((await timeButtons.count()) > 0) {
      await timeButtons.first().click()
      await page.getByRole('option', { name: '14:00' }).click()
    }

    const endTimeButtons = page
      .locator('[role="dialog"] button[role="combobox"]')
      .filter({ hasText: '----' })
    if ((await endTimeButtons.count()) > 0) {
      await endTimeButtons.first().click()
      await page.getByRole('option', { name: '14:50' }).click()
    }

    const saveGroupButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /^Save$|^Guardar$/i })
    await saveGroupButton.click()
    await page.waitForTimeout(300)

    const saveCourseButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /Add Course|Agregar Curso/i })
    await saveCourseButton.click()
    await page.waitForTimeout(500)

    const generateButton = page.getByRole('button', {
      name: /Generate Schedules|Generar Horarios/i,
    })
    await generateButton.click()

    await page.waitForTimeout(3000)

    // Badge shows schedule count - the badge only appears when there are schedules
    // Wait a bit more for the badge to appear after generation
    await page.waitForTimeout(1000)

    // The badge contains a number followed by text about schedules
    // Look for any element with badge-related classes that contains a number
    const badgeElement = page
      .locator('div')
      .filter({ has: page.locator('span.font-semibold') })
      .first()
    await expect(badgeElement).toBeVisible()
  })
})
