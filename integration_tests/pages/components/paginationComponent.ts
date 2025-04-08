/* eslint-disable max-classes-per-file */
import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'

export default class PaginationComponent {
  private elementCacheId: string

  private className: string = '.moj-pagination'

  private get element(): PageElement {
    if (!this.elementCacheId) {
      this.elementCacheId = uuidv4()

      cy.get('body', { log: false }).then($body => {
        const $el = $body.find(this.className)
        cy.wrap($el.length ? $el : undefined, { log: false }).as(`${this.elementCacheId}-element`)
      })
    }

    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  pageLink(page: number): PageElement {
    return this.element.contains('.moj-pagination__item--link', `${page}`, { log: false })
  }

  get activePageLink(): PageElement {
    return this.element.get('.moj-pagination__item--active', { log: false })
  }

  get nextLink(): PageElement {
    return this.element.contains('Next', { log: false })
  }

  get previousLink(): PageElement {
    return this.element.contains('Previous', { log: false })
  }

  // Helpers

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

  shouldShowSummary(start: number, end: number, total: number) {
    this.element.contains(`Showing ${start} to ${end} of ${total} results`)
  }

  shouldShowActivePage(page: number) {
    this.activePageLink.contains(page)
  }
}
