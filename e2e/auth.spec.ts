import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Welcome back')).toBeVisible()
    await expect(page.getByLabel('Email Address')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('shows error for empty fields', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText('Please fill in all fields')).toBeVisible()
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email Address').fill('invalid@test.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()
    // Should show an error (either invalid credentials or network error in test)
    await expect(page.locator('.bg-red-50')).toBeVisible({ timeout: 10000 })
  })

  test('redirects unauthenticated users from portal to login', async ({ page }) => {
    await page.goto('/portal')
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain('/login')
  })

  test('login page has links to opportunity and enroll', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('link', { name: /learn about the opportunity/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /enroll now/i })).toBeVisible()
  })
})
