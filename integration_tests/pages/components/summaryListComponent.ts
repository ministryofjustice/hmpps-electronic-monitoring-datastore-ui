import { PageElement } from '../page'

export default class SummaryListComponent {
  constructor(private readonly label: string) {}

  get element(): PageElement {
    return cy.contains('h2', this.label)
  }

  get list(): PageElement {
    return this.element.siblings('.govuk-summary-list', { log: false })
  }

  // Helpers

  shouldNotExist() {
    this.element.should('not.exist')
    this.list.should('not.exist')
  }

  shouldBeVisible() {
    this.element.should('exist')
    this.list.should('exist')
    this.element.should('be.visible')
    this.list.should('be.visible')
  }

  shouldNotBeVisible() {
    this.element.should('exist')
    this.list.should('exist')
    this.element.should('not.be.visible')
    this.list.should('not.be.visible')
  }

  shouldHaveItem(key: string, value: string) {
    return this.list
      .contains('.govuk-summary-list__key', key, { log: false })
      .siblings('.govuk-summary-list__value', { log: false })
      .then($item => cy.wrap($item.text().trim().replace(/\s+/g, ' ')).should('equal', value))
  }

  shouldHaveItems(items: Array<{ key: string; value: string }>) {
    return items.map(({ key, value }) => this.shouldHaveItem(key, value))
  }

  shouldNotHaveItem(key: string) {
    return this.list.then($items => {
      $items.each((_, $el) => {
        cy.wrap($el.innerText.trim().replace(/\s+/g, ' ')).should('not.equal', key)
      })
    })
  }

  shouldNotHaveItems(keys: Array<string>) {
    return keys.map(key => this.shouldNotHaveItem(key))
  }
}
