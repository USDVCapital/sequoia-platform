import { test, expect } from '@playwright/test'

test.describe('Public Pages', () => {
  test('homepage loads with hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('navigation')).toBeVisible()
    // Homepage should have CTA buttons
    const ctaLinks = page.getByRole('link')
    expect(await ctaLinks.count()).toBeGreaterThan(0)
  })

  test('about page loads', async ({ page }) => {
    await page.goto('/about')
    await expect(page.getByText(/about/i).first()).toBeVisible()
  })

  test('solutions page loads', async ({ page }) => {
    await page.goto('/solutions')
    await expect(page.getByText(/solutions/i).first()).toBeVisible()
  })

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByText(/contact/i).first()).toBeVisible()
  })

  test('opportunity page loads', async ({ page }) => {
    await page.goto('/opportunity')
    await expect(page.getByText(/opportunity/i).first()).toBeVisible()
  })

  test('resources page loads', async ({ page }) => {
    await page.goto('/resources')
    await expect(page.getByText(/resources/i).first()).toBeVisible()
  })

  test('404 page shows for unknown routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
  })

  test('navbar is present on public pages', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('footer is present on public pages', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('footer')).toBeVisible()
  })
})
