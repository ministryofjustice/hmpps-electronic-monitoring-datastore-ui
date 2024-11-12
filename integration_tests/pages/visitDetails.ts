import Page, { PageElement } from './page'

export default class VisitDetailsPage extends Page {
  constructor() {
    super('Visit details')
  }

  override checkOnPage(): void {
    cy.get('caption').contains('Visit details')
  }

  visitsAndTasksTable = (): PageElement => cy.get('.govuk-table')

  columnHeader = (columnHeaderText: string): PageElement => cy.get('.govuk-table__header').contains(columnHeaderText)

  rowHeader = (rowHeaderText: string): PageElement => cy.get('.govuk-table__row').contains(rowHeaderText)
}
