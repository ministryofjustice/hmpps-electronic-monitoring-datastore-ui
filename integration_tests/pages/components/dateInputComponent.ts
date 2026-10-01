import { type Locator } from '@playwright/test'

export default class DateInputComponent {
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

  async fill(dateOfBirth: { day?: number | string; month?: number | string; year?: number | string }) {
    if (dateOfBirth.day !== undefined) {
      await this.fillDay(dateOfBirth.day)
    }
    if (dateOfBirth.month !== undefined) {
      await this.fillMonth(dateOfBirth.month)
    }
    if (dateOfBirth.year !== undefined) {
      await this.fillYear(dateOfBirth.year)
    }
  }

  async isVisible() {
    return Promise.all([this.dayField.isVisible(), this.monthField.isVisible(), this.yearField.isVisible()]).then(
      ([dayVisible, monthVisible, yearVisible]) => dayVisible && monthVisible && yearVisible,
    )
  }

  async isDisabled() {
    return Promise.all([this.dayField.isDisabled(), this.monthField.isDisabled(), this.yearField.isDisabled()]).then(
      ([dayDisabled, monthDisabled, yearDisabled]) => dayDisabled && monthDisabled && yearDisabled,
    )
  }
}
