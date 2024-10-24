import Page, { PageElement } from './page'

export default class VisitsAndTasksPage extends Page {
  constructor() {
    super('Visits and tasks')
  }

  override checkOnPage(): void {
    cy.get('caption').contains('Visits and tasks')
  }

  visitsAndTasksTable = (): PageElement => cy.get('.govuk-table')

  columnHeader = (columnHeaderText: string): PageElement => cy.get('.govuk-table__header').contains(columnHeaderText)

  rowHeader = (rowHeaderText: string): PageElement => cy.get('.govuk-table__row').contains(rowHeaderText)
}
