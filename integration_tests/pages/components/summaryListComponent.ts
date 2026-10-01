import { type Locator, type Page } from '@playwright/test'

export default class SummaryListComponent {
  constructor(
    private readonly parent: Page | Locator,
    readonly label: string,
  ) {}

  // Helpers

  private card: Locator | undefined

  private async getCard(): Promise<Locator | undefined> {
    if (this.card === undefined) {
      const cards = await this.parent.locator('.govuk-summary-card').all()
      this.card = (
        await Promise.all(
          cards.map(async card => ((await card.getByRole('heading', { name: this.label }).count()) > 0 ? card : null)),
        )
      ).find(card => card !== null)
    }

    return this.card
  }

  private readonly keys: string[] = []

  private async getKeys(): Promise<string[]> {
    if (this.keys.length > 0) {
      return this.keys
    }

    const card = await this.getCard()
    if (!card) {
      return []
    }

    const keyLocators = card.locator('.govuk-summary-list__key')
    const keyCount = await keyLocators.count()
    for (let i = 0; i < keyCount; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      this.keys.push(await keyLocators.nth(i).innerText())
    }
    return this.keys
  }

  private async getKeyIndex(key: string): Promise<number> {
    const keys = await this.getKeys()
    return keys.indexOf(key)
  }

  async isVisible(): Promise<boolean> {
    const card = await this.getCard()
    const isVisible = (await card?.isVisible()) && (await card?.locator('.govuk-summary-list').isVisible())
    return isVisible || false
  }

  async hasItem(key: string, value: string): Promise<boolean> {
    const card = await this.getCard()
    if (!card) {
      return false
    }

    const index = await this.getKeyIndex(key)
    const rowLocator = card.locator('.govuk-summary-list__row').nth(index)
    const keyLocator = rowLocator.locator('.govuk-summary-list__key')
    const valueLocator = rowLocator.locator('.govuk-summary-list__value')

    const rowCount = await rowLocator.count()
    const hasRow = rowCount === 1
    const keyCount = await keyLocator.count()
    const hasKey = keyCount === 1
    const valueCount = await valueLocator.count()
    const textValue = valueCount === 1 ? await valueLocator.innerText() : ''
    const hasValue = textValue === value

    return hasRow && hasKey && hasValue
  }
}
