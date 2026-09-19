import { PageElement } from '../page'

export default abstract class FormComponent {
  protected elementCacheId: string = crypto.randomUUID()

  constructor() {
    cy.get('form', { log: false }).as(this.elementCacheId)
  }

  protected get form(): PageElement {
    return cy.get(`@${this.elementCacheId}`, { log: false })
  }

  checkHasForm(): void {
    this.form.should('exist')
  }

  hasAction(action: string | RegExp): PageElement {
    return this.form.should('have.attr', 'action', action)
  }

  shouldHaveEncType(encType: string): PageElement {
    return this.form.should('have.attr', 'encType', encType)
  }
}
