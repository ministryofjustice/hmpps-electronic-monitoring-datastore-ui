/* eslint-disable max-classes-per-file */
import { PageElement } from '../page'

class SearchResultRow {
  private elementCacheId: string = crypto.randomUUID()

  constructor(row: PageElement) {
    row.as(`${this.elementCacheId}-element`)
  }

  protected get element(): PageElement {
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

  shouldHaveValue(index: number, value: string) {
    this.element
      .find('.govuk-table__cell', { log: false })
      .eq(index, { log: false })
      .then($item => cy.wrap($item.text().trim().replace(/\s+/g, ' ')).should('equal', value))
  }

  shouldHaveValues(values: string[]) {
    values.forEach((value, index) => this.shouldHaveValue(index, value))
  }
}

export default class SearchResultsComponent {
  private elementCacheId: string

  private className: string = '.search-results-table'

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

  private get headers(): PageElement {
    return this.element.find('.govuk-table__head .govuk-table__header', { log: false })
  }

  header(index: number): PageElement {
    return this.headers.eq(index, { log: false })
  }

  private get results(): PageElement {
    return this.element.find('.govuk-table__body .govuk-table__row', { log: false })
  }

  result(index: number): SearchResultRow {
    return new SearchResultRow(this.results.eq(index, { log: false }))
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

  shouldHaveHeader(header: string) {
    this.headers.contains(header).should('be.visible')
  }

  shouldHaveHeaders(headers: Array<string>) {
    headers.forEach(header => this.shouldHaveHeader(header))
  }

  shouldHaveResult(index: number, columns: Array<string>) {
    this.result(index).shouldHaveValues(columns)
  }

  shouldHaveResults(results: Array<Array<string>>) {
    results.forEach((columns, index) => this.shouldHaveResult(index, columns))
  }

  shouldHaveCount(numberOfResults: number) {
    this.results.should('have.length', numberOfResults)
  }
}
