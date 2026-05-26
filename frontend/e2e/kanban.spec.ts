import { test, expect } from '@playwright/test'

test.describe('Kanban board', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads with 5 column headers', async ({ page }) => {
    await expect(page.getByTestId('column-header-col-1')).toHaveText('Backlog')
    await expect(page.getByTestId('column-header-col-2')).toHaveText('To Do')
    await expect(page.getByTestId('column-header-col-3')).toHaveText('In Progress')
    await expect(page.getByTestId('column-header-col-4')).toHaveText('Review')
    await expect(page.getByTestId('column-header-col-5')).toHaveText('Done')
  })

  test('loads with dummy cards', async ({ page }) => {
    await expect(page.getByTestId('card-card-1')).toBeVisible()
    await expect(page.getByTestId('card-card-6')).toBeVisible()
  })

  test('adds a card to a column', async ({ page }) => {
    await page.getByTestId('add-card-col-2').click()
    await page.getByPlaceholder('Card title').fill('E2E test card')
    await page.getByPlaceholder('Add details...').fill('Added from Playwright')
    await page.getByRole('button', { name: /save/i }).click()
    await expect(page.getByTestId('column-cards-col-2').getByText('E2E test card')).toBeVisible()
  })

  test('deletes a card', async ({ page }) => {
    const card = page.getByTestId('card-card-1')
    await expect(card).toBeVisible()
    await card.hover()
    await page.getByTestId('delete-card-card-1').click()
    await expect(card).not.toBeVisible()
  })

  test('renames a column by double-clicking the header', async ({ page }) => {
    const header = page.getByTestId('column-header-col-1')
    await header.dblclick()
    const input = page.getByTestId('column-name-input-col-1')
    await input.fill('Discovery')
    await input.press('Enter')
    await expect(page.getByTestId('column-header-col-1')).toHaveText('Discovery')
  })

  test('edits a card by clicking it', async ({ page }) => {
    await page.getByTestId('card-card-1').click()
    const titleInput = page.getByPlaceholder('Card title')
    await expect(titleInput).toHaveValue('Research competitors')
    await titleInput.fill('Updated title')
    await page.getByRole('button', { name: /save/i }).click()
    await expect(page.getByTestId('card-card-1').getByText('Updated title')).toBeVisible()
  })

  test('drags a card from one column to another', async ({ page }) => {
    const sourceCard = page.getByTestId('card-card-1')
    const targetArea = page.getByTestId('column-cards-col-2')

    const sourceBounds = await sourceCard.boundingBox()
    const targetBounds = await targetArea.boundingBox()
    if (!sourceBounds || !targetBounds) throw new Error('Could not get bounding boxes')

    const sx = sourceBounds.x + sourceBounds.width / 2
    const sy = sourceBounds.y + sourceBounds.height / 2
    const tx = targetBounds.x + targetBounds.width / 2
    const ty = targetBounds.y + 10

    await page.mouse.move(sx, sy)
    await page.mouse.down()
    await page.mouse.move(sx + 10, sy, { steps: 3 })
    await page.mouse.move(tx, ty, { steps: 15 })
    await page.mouse.up()

    await expect(page.getByTestId('column-cards-col-2').getByText('Research competitors')).toBeVisible()
  })
})
