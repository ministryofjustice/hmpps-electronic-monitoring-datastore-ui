import { type Locator } from '@playwright/test'

export default class FormDateComponent {
  readonly element: Locator

  readonly dayField: Locator

  readonly monthField: Locator

  readonly yearField: Locator

  readonly validation: Locator

  constructor(
    private readonly form: Locator,
    private readonly label: string,
  ) {
    const fieldset = this.form.getByRole('group', { name: this.label })

    this.dayField = fieldset.getByLabel('Day')
    this.monthField = fieldset.getByLabel('Month')
    this.yearField = fieldset.getByLabel('Year')

    this.element = this.form.locator('.govuk-form-group', { hasText: this.label })

    this.validation = this.element.locator('.govuk-error-message')
  }

  async fillDay(value: number | string) {
    await this.dayField.fill(value.toString())
  }

  async fillMonth(value: number | string) {
    await this.monthField.fill(value.toString())
  }

  async fillYear(value: number | string) {
    await this.yearField.fill(value.toString())
  }

  async fill(day: number | string, month: number | string, year: number | string) {
    await this.fillDay(day)
    await this.fillMonth(month)
    await this.fillYear(year)
  }
}
