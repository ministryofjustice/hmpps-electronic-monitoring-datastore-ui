import { expect, type Locator, type Page } from '@playwright/test'

export default abstract class FormComponent {
  readonly page: Page

  protected readonly element: Locator

  constructor(page: Page) {
    this.page = page

    this.element = this.page.getByRole('form')
  }

  async checkHasForm(): Promise<void> {
    await expect(this.element).toBeVisible()
  }

  async hasAction(action: string | RegExp): Promise<void> {
    await expect(this.element).toHaveAttribute('action', action)
  }

  async shouldHaveEncType(encType: string): Promise<void> {
    await expect(this.element).toHaveAttribute('encType', encType)
  }
}
