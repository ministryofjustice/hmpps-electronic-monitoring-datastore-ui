import { type Locator, type Page } from '@playwright/test'

export default class SummaryListComponent {
  private element: Locator

  readonly title: Locator

  readonly list: Locator

  constructor(
    private readonly page: Page,
    readonly label: string,
  ) {
    this.title = page.getByRole('heading', { name: this.label })
    this.element = page.locator('.govuk-summary-card', { has: this.title })
    this.list = this.element.locator('.govuk-summary-list')
  }

  // Helpers

  async isVisible(): Promise<boolean> {
    const isElementVisible = await this.element.isVisible()
    const isListVisible = await this.list.isVisible()

    return isElementVisible && isListVisible
  }

  async hasItem(key: string, value: string): Promise<boolean> {
    const keyLocator = this.page.locator('.govuk-summary-list__key', { hasText: key })
    const rowLocator = this.list.locator('.govuk-summary-list__row', { has: keyLocator })
    const valueLocator = rowLocator.locator('.govuk-summary-list__value')

    const hasRow = (await rowLocator.count()) === 1
    const hasKey = (await keyLocator.count()) === 1
    const textValue = (await valueLocator.count()) === 1 ? await valueLocator.innerText() : ''
    const hasValue = textValue === value

    return hasRow && hasKey && hasValue
  }

  async hasItems(items: Array<[string, string]>): Promise<boolean> {
    return (await Promise.all(items.map(([key, value]) => this.hasItem(key, value)))).every(Boolean)
  }
}
