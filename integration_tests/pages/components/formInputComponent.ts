import { PageElement } from '../page'

export default class FormInputComponent {
  private elementCacheId: string = crypto.randomUUID()

  constructor(
    private readonly parent: PageElement,
    private readonly label: string,
  ) {
    this.parent.getByLabel(this.label, { log: false }).as(`${this.elementCacheId}-element`)
    this.element.should('exist')
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  set(value?: string | number | boolean) {
    this.element.type(value as string)
  }

  shouldHaveValue(value?: string | number | boolean) {
    this.element.should('have.value', value as string)
  }

  shouldBeDisabled() {
    this.element.should('be.disabled')
  }

  shouldNotBeDisabled(): void {
    this.element.should('not.be.disabled')
  }

  get validationMessage() {
    return this.element.siblings('.govuk-error-message', { log: false })
  }

  shouldHaveValidationMessage(message: string) {
    this.validationMessage.should('contain', message)
  }

  shouldNotHaveValidationMessage(): void {
    this.validationMessage.should('not.exist')
  }

  shouldExist(): void {
    this.element.should('exist')
  }
}
