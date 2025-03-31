import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'

export default class OrderDetailsPage extends AppPage {
  constructor() {
    super('Order details', paths.INTEGRITY_ORDER.DETAILS)
  }

  deviceWearerTable = (): PageElement =>
    cy.contains('.govuk-table__caption', 'Device wearer data').closest('.govuk-table').find('.govuk-table__body')

  orderTable = (): PageElement =>
    cy.contains('.govuk-table__caption', 'Order data').closest('.govuk-table').find('.govuk-table__body')

  tableCell = (cellText): PageElement => cy.get('.govuk-table__cell').contains(cellText).first()

  deviceWearerRowHeaders = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__row').contains(columnHeaderText)

  orderDetailsRowHeaders = (rowHeaderText: string): PageElement => cy.get('.govuk-table__row').contains(rowHeaderText)
}
