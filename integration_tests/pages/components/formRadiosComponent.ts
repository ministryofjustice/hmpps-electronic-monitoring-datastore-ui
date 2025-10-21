import { PageElement } from '../page'

export default class FormRadiosComponent {
  private elementCacheId: string = crypto.randomUUID()

  constructor(
    private readonly parent: PageElement,
    private readonly label: string,
    private readonly options: (string | RegExp)[],
  ) {
    this.parent.getByLegend(this.label, { log: false }).as(`${this.elementCacheId}-element`)
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  set(value: string | RegExp) {
    this.element.getByLabel(value).check()
  }

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

  get validationMessage() {
    return this.element.children('.govuk-error-message', { log: false })
  }

  shouldHaveValidationMessage(message: string): void {
    this.validationMessage.should('contain', message)
  }

  shouldNotHaveValidationMessage(): void {
    this.validationMessage.should('not.exist')
  }

  shouldHaveAllOptions(): void {
    this.options.forEach(option => this.shouldHaveOption(option))
  }
}
