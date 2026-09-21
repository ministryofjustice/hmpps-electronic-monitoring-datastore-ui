import { type Locator, type Page } from '@playwright/test'

export default class ErrorSummaryComponent {
  private element: Locator

  readonly title: Locator

  readonly errorList: Locator

  constructor(page: Page) {
    this.element = page.locator('.govuk-error-summary')
    this.title = this.element.locator('.govuk-error-summary__title')
    this.errorList = this.element.locator('.govuk-error-summary__list')
  }
}
