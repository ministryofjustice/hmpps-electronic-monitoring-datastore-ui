import { type Locator } from '@playwright/test'

export default class RadiosComponent {
  readonly element: Locator

  readonly validation: Locator

  constructor(
    private readonly form: Locator,
    private readonly label: string,
  ) {
    this.element = this.form.locator('.govuk-form-group', { hasText: this.label })

    this.validation = this.element.locator('.govuk-error-message')
  }

  private async getOption(value: string | RegExp) {
    return this.element.getByRole('radio', { name: value })
  }

  async check(value: string | RegExp) {
    return (await this.getOption(value))?.check()
  }

  /*
  shouldHaveValue(value: string): void {
    this.element.getByLabel(value).should('be.checked')
  }

  shouldNotHaveValue(): void {
    this.options.forEach(option => this.element.getByLabel(option).should('not.be.checked'))
  }

  shouldHaveOption(value: string | RegExp): void {
    this.element.getByLabel(value).should('exist')
  }

  shouldNotHaveOption(value: string | RegExp): void {
    this.element.get('label').should('not.contain', value)
  }

  shouldHaveDisabledOption(value: string | RegExp): void {
    this.element.getByLabel(value).should('be.disabled')
  }

  shouldExist(): void {
    this.element.should('exist')
  }

  shouldNotExist(): void {
    this.element.should('not.exist')
  }

  shouldBeDisabled(): void {
    this.element.find('input[type=radio]').each(input => cy.wrap(input).should('be.disabled'))
  }

  shouldNotBeDisabled(): void {
    this.element.find('input[type=radio]').each(input => cy.wrap(input).should('not.be.disabled'))
  }

  shouldHaveAllOptions(): void {
    this.options.forEach(option => this.shouldHaveOption(option))
  }
  */

  async isVisible() {
    const visibilityChecks = (await this.element.getByRole('radio').all()).map(option => option.isVisible())
    return (await Promise.all(visibilityChecks)).reduce((acc: boolean, curr: boolean) => acc && curr, true)
  }

  async isDisabled() {
    const disabledChecks = (await this.element.getByRole('radio').all()).map(option => option.isDisabled())
    return (await Promise.all(disabledChecks)).reduce((acc: boolean, curr: boolean) => acc && curr, true)
  }
}
