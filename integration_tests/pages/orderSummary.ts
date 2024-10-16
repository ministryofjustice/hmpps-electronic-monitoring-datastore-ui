import Page, { PageElement } from './page'

export default class OrderSummaryPage extends Page {
  constructor() {
    super('Key order details')
  }

  override checkOnPage(): void {
    cy.get('caption').contains('Key order details')
  }

  legacySubjectId = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Legacy subject ID')
}
