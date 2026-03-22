import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Course Linking Feature
 * Tests creating links between courses to group their schedules
 *
 * Note: App uses i18n with English/Spanish translations
 * The Link Courses button appears in the sidebar when 2+ courses exist
 */

test.describe('Course Linking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Clear storage and mark onboarding as completed
    await page.evaluate(() => {
      localStorage.clear()
      // Set onboarding as completed to bypass onboarding flow
      localStorage.setItem('horariu-onboarding', JSON.stringify({
        state: { hasCompletedOnboarding: true, currentStep: 0 },
        version: 0
      }))
    })
    await page.reload()
    await page.waitForSelector('[data-sidebar="sidebar"]', { timeout: 10000 })
  })

  // Day mapping: English short name -> Spanish/code alternative
  const dayMap: Record<string, string> = {
    'Mo': 'L',
    'Tu': 'K',
    'We': 'M',
    'Th': 'J',
    'Fr': 'V',
    'Sa': 'S',
    'Su': 'D'
  }

  // Helper to create a course with a group
  async function createCourse(
    page: test.Page,
    courseName: string,
    groupName: string,
    dayShort: string, // e.g., 'Mo', 'Tu', 'We'
    startTime: string,
    endTime: string
  ) {
    const addCourseButton = page.getByRole('button', { name: /Add.*course|Agregar.*curso/i })
    await addCourseButton.click()
    await page.waitForTimeout(300)

    await page.locator('[role="dialog"] input[name="courseName"]').fill(courseName)

    await page.locator('[role="dialog"]').getByRole('button', { name: /Add Group|Agregar Grupo/i }).click()
    await page.waitForTimeout(300)

    await page.locator('[role="dialog"] input[name="groupName"]').fill(groupName)

    // Select day - handles both English (Mo) and Spanish (L) short names
    const altDay = dayMap[dayShort] || dayShort
    const dayButton = page.locator('[role="dialog"] button').filter({ hasText: new RegExp(`^${dayShort}$|^${altDay}$`, 'i') })
    await dayButton.click()
    await page.waitForTimeout(200)

    // Select start time
    const startCombo = page.locator('[role="dialog"] button[role="combobox"]').filter({ hasText: '----' }).first()
    if (await startCombo.count()) {
      await startCombo.click()
      await page.getByRole('option', { name: startTime }).click()
    }

    // Select end time
    const endCombo = page.locator('[role="dialog"] button[role="combobox"]').filter({ hasText: '----' }).first()
    if (await endCombo.count()) {
      await endCombo.click()
      await page.getByRole('option', { name: endTime }).click()
    }

    await page.locator('[role="dialog"]').getByRole('button', { name: /^Save$|^Guardar$/i }).click()
    await page.waitForTimeout(300)

    await page.locator('[role="dialog"]').getByRole('button', { name: /Add Course|Agregar Curso/i }).click()
    await page.waitForTimeout(500)
  }

  test('should not show link button when less than 2 courses exist', async ({ page }) => {
    // Create only one course
    await createCourse(page, 'Course 1', 'Group A', 'Mo', '08:00', '08:50')

    // Link button should be disabled
    const linkButton = page.getByRole('button', { name: /Link Courses|Vincular Cursos/i })
    await expect(linkButton).toBeDisabled()
  })

  test('should show link button when 2+ courses exist', async ({ page }) => {
    await createCourse(page, 'Theory', 'Section A', 'Mo', '08:00', '08:50')
    await createCourse(page, 'Lab', 'Lab A', 'Tu', '09:00', '09:50')

    // Link button should be enabled
    const linkButton = page.getByRole('button', { name: /Link Courses|Vincular Cursos/i })
    await expect(linkButton).toBeEnabled()
  })

  test('should open link dialog and show empty state', async ({ page }) => {
    await createCourse(page, 'Theory', 'Section A', 'Mo', '08:00', '08:50')
    await createCourse(page, 'Lab', 'Lab A', 'Tu', '09:00', '09:50')

    // Click link button
    const linkButton = page.getByRole('button', { name: /Link Courses|Vincular Cursos/i })
    await linkButton.click()
    await page.waitForTimeout(300)

    // Dialog should open with empty state message
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // "No links yet" / "No hay vínculos"
    const emptyState = page.getByText(/No links yet|No hay vínculos/i)
    await expect(emptyState).toBeVisible()
  })

  test('should create a new link between two courses', async ({ page }) => {
    await createCourse(page, 'Math Theory', 'Section A', 'Mo', '08:00', '08:50')
    await createCourse(page, 'Math Lab', 'Lab A', 'Tu', '09:00', '09:50')

    // Open link dialog
    await page.getByRole('button', { name: /Link Courses|Vincular Cursos/i }).click()
    await page.waitForTimeout(300)

    // Click "Create New Link"
    const createButton = page.getByRole('button', { name: /Create New Link|Crear Nuevo Vínculo/i })
    await createButton.click()
    await page.waitForTimeout(300)

    // Select both courses in step 1
    const theoryOption = page.locator('[role="dialog"]').getByText('Math Theory')
    const labOption = page.locator('[role="dialog"]').getByText('Math Lab')
    await theoryOption.click()
    await labOption.click()

    // Proceed to step 2
    const nextButton = page.getByRole('button', { name: /Next|Siguiente/i })
    await nextButton.click()
    await page.waitForTimeout(300)

    // In step 2: Select groups to connect
    // Click Section A under Math Theory
    const sectionA = page.locator('[role="dialog"]').getByText('Section A')
    await sectionA.click()

    // Click Lab A under Math Lab
    const labA = page.locator('[role="dialog"]').getByText('Lab A')
    await labA.click()

    // Click "Add Connection" / "Agregar conexión"
    const addConnectionBtn = page.getByRole('button', { name: /Add Connection|Agregar conexi[oó]n/i })
    await addConnectionBtn.click()
    await page.waitForTimeout(200)

    // The connection should appear in the list
    const connectionList = page.locator('[role="dialog"]').getByText(/Math Theory.*Section A|Section A.*Math Theory/i)
    await expect(connectionList.first()).toBeVisible()

    // Click "Create Link" to finish
    const createLinkBtn = page.getByRole('button', { name: /Create Link|Crear V[ií]nculo/i })
    await createLinkBtn.click()
    await page.waitForTimeout(500)

    // After creating, dialog returns to list view showing the new link
    // Should see the linked courses in the dialog
    const linkedCourses = page.locator('[role="dialog"]').getByText('Math Theory')
    await expect(linkedCourses.first()).toBeVisible()

    // Should also see the connection count
    const connectionCount = page.locator('[role="dialog"]').getByText(/1 conex|1 connection/i)
    await expect(connectionCount.first()).toBeVisible()
  })
})

