import { expect, type Locator, type Page } from '@playwright/test'

export default class ErrorSummaryComponent {
  private element: Locator

  readonly title: Locator

  readonly errorList: Locator

  constructor(page: Page) {
    this.element = page.locator('.govuk-error-summary')
    this.title = this.element.locator('.govuk-error-summary__title')
    this.errorList = this.element.locator('.govuk-error-summary__list')
  }

  async shouldExist(): Promise<void> {
    await expect(this.element).toBeVisible()
  }

  async shouldNotExist(): Promise<void> {
    await expect(this.element).not.toBeVisible()
  }

  async shouldHaveError(error: string): Promise<void> {
    return expect(this.errorList.getByText(error)).toBeVisible()
  }

  async shouldHaveTitle(title: string): Promise<void> {
    return expect(this.title).toHaveText(title)
  }
}
