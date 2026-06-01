import { PageElement } from '../page'

const paginationSelector = '.moj-pagination'
const pageLinkSelector = '.govuk-pagination__item .govuk-pagination__link'
const currentPageLinkSelector = '.govuk-pagination__item--current .govuk-pagination__link'

const nextText = 'Next'
const previousText = 'Previous'

export default class PaginationComponent {
  private elementCacheId: string

  private className: string = paginationSelector

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

  pageLink(page: number): PageElement {
    return this.element.contains(pageLinkSelector, `${page}`, { log: false })
  }

  get currentPageLink(): PageElement {
    return this.element.get(currentPageLinkSelector, { log: false })
  }

  get nextLink(): PageElement {
    return this.element.contains(nextText, { log: false })
  }

  get previousLink(): PageElement {
    return this.element.contains(previousText, { log: false })
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
    this.currentPageLink.contains(page)
  }
}
