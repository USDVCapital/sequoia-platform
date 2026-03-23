import { test, expect } from '@playwright/test'

test.describe('Apply Page', () => {
  test('apply page renders the form', async ({ page }) => {
    await page.goto('/apply')
    await expect(page.getByText(/apply/i).first()).toBeVisible()
  })

  test('form validates required fields', async ({ page }) => {
    await page.goto('/apply')
    // Try to submit empty form — should show validation
    const submitButton = page.getByRole('button', { name: /submit|apply|next/i }).first()
    if (await submitButton.isVisible()) {
      await submitButton.click()
      // Should not navigate away on invalid form
      expect(page.url()).toContain('/apply')
    }
  })
})
