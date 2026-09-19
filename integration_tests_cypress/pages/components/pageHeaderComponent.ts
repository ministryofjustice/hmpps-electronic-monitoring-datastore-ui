import { PageElement } from '../page'

export default class PageHeaderComponent {
  private elementCacheId: string

  private className: string = '[role=banner].hmpps-header'

  private get element(): PageElement {
    if (!this.elementCacheId) {
      this.elementCacheId = crypto.randomUUID()

      cy.get('body', { log: false }).then($body => {
        const $el = $body.find(this.className)
        cy.wrap($el.length ? $el : undefined, { log: false }).as(`${this.elementCacheId}-element`)
      })
    }

    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  shouldNotExist() {
    this.element.should('not.exist')
  }

  shouldBeVisible() {
    this.element.should('exist')
    this.element.should('be.visible')
  }

  shouldNotBeVisible() {
    this.element.should('exist')
    this.element.should('not.be.visible')
  }

  checkHasHeader(): void {
    this.element.contains('Electronic Monitoring Datastore', { log: false })
  }

  get signOut(): PageElement {
    return this.element.get('[data-qa=signOut]')
  }

  get manageDetails(): PageElement {
    return this.element.get('[data-qa=manageDetails]')
  }

  get userName(): PageElement {
    return this.element.get('[data-qa=header-user-name]')
  }

  get phaseBanner(): PageElement {
    return this.element.get('[data-qa=header-phase-banner]')
  }
}
