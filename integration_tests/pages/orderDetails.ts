import Page, { PageElement } from './page'

export default class OrderDetailsPage extends Page {
  constructor() {
    super('Order details')
  }

  override checkOnPage(): void {
    cy.get('caption').contains('Order details')
  }

  orderDetailsTable = (): PageElement => cy.get('.govuk-table__body')

  orderDetailsColumnHeaders = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__row').contains(columnHeaderText)

  orderDetailsRowHeaders = (rowHeaderText: string): PageElement => cy.get('.govuk-table__row').contains(rowHeaderText)
}
