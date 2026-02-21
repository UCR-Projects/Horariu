import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Course Management Flow
 * Tests the complete CRUD operations for courses in the sidebar
 *
 * Note: App uses i18n, day buttons show translated short names (Mo, Tu, We, etc.)
 * Form inputs: courseName for course, groupName for group
 */

test.describe('Course Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForSelector('[data-sidebar="sidebar"]', { timeout: 10000 })
  })

  test('should display empty state when no courses exist', async ({ page }) => {
    // "noCoursesYet": EN="No courses added yet", ES="No se han agregado cursos aún"
    const emptyMessage = page.getByText(/No courses added yet|No se han agregado cursos/i)
    await expect(emptyMessage).toBeVisible()
  })

  test('should open course form dialog when clicking add course button', async ({ page }) => {
    // "Add Course" / "Agregar Curso"
    const addCourseButton = page.getByRole('button', { name: /Add Course|Agregar Curso/i })
    await addCourseButton.click()

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()
  })

  test('should create a new course with a group', async ({ page }) => {
    // Open course form
    const addCourseButton = page.getByRole('button', { name: /Add Course|Agregar Curso/i })
    await addCourseButton.click()
    await page.waitForTimeout(300)

    // Fill course name - input has name="courseName"
    const courseNameInput = page.locator('[role="dialog"] input[name="courseName"]')
    await courseNameInput.fill('Mathematics 101')

    // Add a group - "Add Group" / "Agregar Grupo"
    const addGroupButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /Add Group|Agregar Grupo/i })
    await addGroupButton.click()
    await page.waitForTimeout(300)

    // Fill group name - input has name="groupName"
    const groupNameInput = page.locator('[role="dialog"] input[name="groupName"]')
    await groupNameInput.fill('Section A')

    // Select Monday - shows as "Mo" (English) / "L" (Spanish)
    const mondayButton = page.locator('[role="dialog"] button').filter({ hasText: /^Mo$|^L$/i })
    await mondayButton.click()
    await page.waitForTimeout(200)

    // Select start time - placeholder shows "----"
    const timeButtons = page
      .locator('[role="dialog"] button[role="combobox"]')
      .filter({ hasText: '----' })
    if ((await timeButtons.count()) > 0) {
      await timeButtons.first().click()
      await page.getByRole('option', { name: '07:00' }).click()
    }

    // Select end time
    const endTimeButtons = page
      .locator('[role="dialog"] button[role="combobox"]')
      .filter({ hasText: '----' })
    if ((await endTimeButtons.count()) > 0) {
      await endTimeButtons.first().click()
      await page.getByRole('option', { name: '07:50' }).click()
    }

    // Save group - "Save" / "Guardar"
    const saveGroupButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /^Save$|^Guardar$/i })
    await saveGroupButton.click()
    await page.waitForTimeout(300)

    // Save course - when creating new course, button says "Add Course" / "Agregar Curso"
    const saveCourseButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /Add Course|Agregar Curso/i })
    await saveCourseButton.click()
    await page.waitForTimeout(500)

    // Verify course appears in sidebar
    const courseInSidebar = page.getByText('Mathematics 101')
    await expect(courseInSidebar).toBeVisible()
  })

  test('should toggle course visibility', async ({ page }) => {
    // Create a course first
    const addCourseButton = page.getByRole('button', { name: /Add Course|Agregar Curso/i })
    await addCourseButton.click()
    await page.waitForTimeout(300)

    const courseNameInput = page.locator('[role="dialog"] input[name="courseName"]')
    await courseNameInput.fill('Physics 201')

    const addGroupButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /Add Group|Agregar Grupo/i })
    await addGroupButton.click()
    await page.waitForTimeout(300)

    const groupNameInput = page.locator('[role="dialog"] input[name="groupName"]')
    await groupNameInput.fill('Lab 1')

    // Select Tuesday - "Tu" (English) / "K" (Spanish)
    const tuesdayButton = page.locator('[role="dialog"] button').filter({ hasText: /^Tu$|^K$/i })
    await tuesdayButton.click()
    await page.waitForTimeout(200)

    const timeButtons = page
      .locator('[role="dialog"] button[role="combobox"]')
      .filter({ hasText: '----' })
    if ((await timeButtons.count()) > 0) {
      await timeButtons.first().click()
      await page.getByRole('option', { name: '09:00' }).click()
    }

    const endTimeButtons = page
      .locator('[role="dialog"] button[role="combobox"]')
      .filter({ hasText: '----' })
    if ((await endTimeButtons.count()) > 0) {
      await endTimeButtons.first().click()
      await page.getByRole('option', { name: '09:50' }).click()
    }

    const saveGroupButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /^Save$|^Guardar$/i })
    await saveGroupButton.click()
    await page.waitForTimeout(300)

    // Save course - when creating new, button says "Add Course"
    const saveCourseButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /Add Course|Agregar Curso/i })
    await saveCourseButton.click()
    await page.waitForTimeout(500)

    // Find the course item and click visibility toggle (Eye icon button)
    const courseItem = page.locator('[data-sidebar="menu-item"]').filter({ hasText: 'Physics 201' })
    // The visibility button contains the Eye/EyeOff icon
    const visibilityButton = courseItem
      .locator('button')
      .filter({ has: page.locator('svg.lucide-eye') })
    await visibilityButton.click()
    await page.waitForTimeout(300)

    // After clicking, the course item should have opacity-50 class
    // The div with opacity-50 is the direct child div of SidebarMenuItem
    await expect(courseItem.locator('div').first()).toHaveClass(/opacity-50/)
  })

  test('should delete a course', async ({ page }) => {
    // Create a course first
    const addCourseButton = page.getByRole('button', { name: /Add Course|Agregar Curso/i })
    await addCourseButton.click()
    await page.waitForTimeout(300)

    const courseNameInput = page.locator('[role="dialog"] input[name="courseName"]')
    await courseNameInput.fill('Chemistry 301')

    const addGroupButton = page
      .locator('[role="dialog"]')
      .getByRole('button', { name: /Add Group|Agregar Grupo/i })
    await addGroupButton.click()
    await page.waitForTimeout(300)

    const groupNameInput = page.locator('[role="dialog"] input[name="groupName"]')
    await groupNameInput.fill('Theory')

    // Select Wednesday - "We" (English) / "M" (Spanish)
    const wednesdayButton = page.locator('[role="dialog"] button').filter({ hasText: /^We$|^M$/i })
    await wednesdayButton.click()
    await page.waitForTimeout(200)

    const timeButtons = page
      .locator('[role="dialog"] button[role="combobox"]')
      .filter({ hasText: '----' })
    if ((await timeButtons.count()) > 0) {
      await timeButtons.first().click()
      await page.getByRole('option', { name: '11:00' }).click()
    }

    const endTimeButtons = page
      .locator('[role="dialog"] button[role="combobox"]')
      .filter({ hasText: '----' })
    if ((await endTimeButtons.count()) > 0) {
      await endTimeButtons.first().click()
      await page.getByRole('option', { name: '11:50' }).click()
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

    // Verify course exists
    const courseInSidebar = page.getByText('Chemistry 301')
    await expect(courseInSidebar).toBeVisible()

    // Find and click delete trigger (button with Trash icon inside course actions)
    const courseItem = page
      .locator('[data-sidebar="menu-item"]')
      .filter({ hasText: 'Chemistry 301' })
    // The delete trigger is now a button (accessibility improvement)
    const deleteButton = courseItem.locator('button[aria-label*="Delete"], button[aria-label*="Eliminar"]').first()
    await deleteButton.click()
    await page.waitForTimeout(300)

    // Confirm deletion in AlertDialog - "Delete" / "Eliminar"
    const confirmButton = page
      .locator('[role="alertdialog"]')
      .getByRole('button', { name: /^Delete$|^Eliminar$/i })
    await confirmButton.click()
    await page.waitForTimeout(300)

    // Verify course is removed
    await expect(courseInSidebar).not.toBeVisible()
  })
})
