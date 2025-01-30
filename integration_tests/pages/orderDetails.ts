import Page, { PageElement } from './page'

export default class OrderDetailsPage extends Page {
  constructor() {
    super('Order details')
  }

  deviceWearerTable = (): PageElement =>
    cy.contains('.govuk-table__caption', 'Device wearer data').closest('.govuk-table').find('.govuk-table__body')

  orderTable = (): PageElement =>
    cy.contains('.govuk-table__caption', 'Order data').closest('.govuk-table').find('.govuk-table__body')

  deviceWearerRowHeaders = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__row').contains(columnHeaderText)

  orderDetailsRowHeaders = (rowHeaderText: string): PageElement => cy.get('.govuk-table__row').contains(rowHeaderText)
}
