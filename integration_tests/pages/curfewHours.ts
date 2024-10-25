import Page, { PageElement } from './page'

export default class CurfewHoursPage extends Page {
  constructor() {
    super('Curfew hours')
  }

  override checkOnPage(): void {
    cy.get('caption').contains('Curfew hours')
  }

  curfewHoursTable = (): PageElement => cy.get('.govuk-table__body')

  curfewHoursColumnHeaders = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__row').contains(columnHeaderText)

  curfewHoursRowHeaders = (rowHeaderText: string): PageElement => cy.get('.govuk-table__row').contains(rowHeaderText)
}
