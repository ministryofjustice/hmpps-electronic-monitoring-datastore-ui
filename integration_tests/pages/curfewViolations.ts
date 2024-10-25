import Page, { PageElement } from './page'

export default class CurfewViolationsPage extends Page {
  constructor() {
    super('Violations')
  }

  timeline = (): PageElement => cy.get('.moj-timeline')

  timelineItems = (): PageElement => cy.get('.moj-timeline__item')

  violationsTableColumnHeaders = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__header[scope=col]').contains(columnHeaderText)

  violationsTableRowHeaders = (rowHeaderText: string): PageElement =>
    cy.get('.govuk-table__header[scope=row]').contains(rowHeaderText)
}
