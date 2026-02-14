import { test as base, expect, Page } from '@playwright/test'

/**
 * Test fixtures and helpers for Horariu E2E tests
 * Following Playwright best practices: https://playwright.dev/docs/test-fixtures
 */

// Test data for courses
export const testCourse = {
  name: 'Test Course E2E',
  groupName: 'Group A',
}

// Helper to clear localStorage before tests
export async function clearAppState(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear()
  })
}

// Helper to wait for app to be fully loaded
export async function waitForAppLoad(page: Page): Promise<void> {
  await page.waitForSelector('[data-sidebar="sidebar"]', { timeout: 10000 })
}

// Helper to open course form dialog
export async function openCourseFormDialog(page: Page): Promise<void> {
  const addCourseButton = page.getByRole('button', { name: /add course|agregar curso/i })
  await addCourseButton.click()
  await page.waitForSelector('[role="dialog"]', { timeout: 5000 })
}

// Helper to fill course name
export async function fillCourseName(page: Page, name: string): Promise<void> {
  const courseNameInput = page.getByPlaceholder(/e\.g\.|ej\./i)
  await courseNameInput.fill(name)
}

// Helper to add a group with schedule
export async function addGroupWithSchedule(
  page: Page,
  groupName: string,
  day: 'L' | 'M' | 'X' | 'J' | 'V' | 'S'
): Promise<void> {
  // Click "Add Group" button
  const addGroupButton = page.getByRole('button', { name: /add group|agregar grupo/i })
  await addGroupButton.click()

  // Wait for group form
  await page.waitForTimeout(300)

  // Fill group name
  const groupNameInput = page.locator('input[name="name"]')
  await groupNameInput.fill(groupName)

  // Select day
  const dayButton = page.getByRole('button', { name: day, exact: true })
  await dayButton.click()

  // Wait for time selectors to appear
  await page.waitForTimeout(200)

  // Select start time (first available)
  const startTimeSelect = page.locator('button').filter({ hasText: /--:--/i }).first()
  if (await startTimeSelect.isVisible()) {
    await startTimeSelect.click()
    await page.getByRole('option', { name: '07:00' }).click()
  }

  // Select end time
  const endTimeSelect = page.locator('button').filter({ hasText: /--:--/i }).first()
  if (await endTimeSelect.isVisible()) {
    await endTimeSelect.click()
    await page.getByRole('option', { name: '08:00' }).click()
  }

  // Save group
  const saveGroupButton = page.getByRole('button', { name: /save|guardar/i }).first()
  await saveGroupButton.click()

  // Wait for return to course form
  await page.waitForTimeout(300)
}

// Helper to save course
export async function saveCourse(page: Page): Promise<void> {
  const saveCourseButton = page.getByRole('button', { name: /save course|guardar curso/i })
  await saveCourseButton.click()
  // Wait for dialog to close
  await page.waitForTimeout(500)
}

// Helper to check if course exists in sidebar
export async function courseExistsInSidebar(page: Page, courseName: string): Promise<boolean> {
  const courseElement = page.locator('[data-sidebar="menu"]').getByText(courseName, { exact: false })
  return courseElement.isVisible()
}

// Extended test with app fixtures
export const test = base.extend<{ appPage: Page }>({
  appPage: async ({ page }, use) => {
    // Navigate to the app
    await page.goto('/')
    await waitForAppLoad(page)
    await use(page)
  },
})

export { expect }

