import { type Locator } from '@playwright/test'

export default class TextInputComponent {
  readonly element: Locator

  readonly field: Locator

  readonly validation: Locator

  constructor(
    private readonly form: Locator,
    private readonly label: string,
  ) {
    this.field = this.form.locator('.govuk-input').and(this.form.getByLabel(this.label))

    this.element = this.form.locator('.govuk-form-group', { hasText: this.label })

    this.validation = this.element.locator('.govuk-error-message')
  }

  async fill(value?: string | number | boolean) {
    await this.field.fill(value as string)
  }

  async isVisible() {
    return this.field.isVisible()
  }

  async isDisabled() {
    return this.field.isDisabled()
  }
}
