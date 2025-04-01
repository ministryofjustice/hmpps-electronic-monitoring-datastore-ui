import { v4 as uuidv4 } from 'uuid'

import PageElement from '../pages/PageElement'

export default class PageHeaderComponent {
  private elementCacheId: string = uuidv4()

  constructor() {
    cy.get('[role=banner].hmpps-header', { log: false }).as(`${this.elementCacheId}-element`)
    this.element.should('exist')
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
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
