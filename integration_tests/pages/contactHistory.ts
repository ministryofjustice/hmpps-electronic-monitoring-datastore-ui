import Page, { PageElement } from './page'

export default class ContactHistoryPage extends Page {
  constructor() {
    super('Contact history')
  }

  timeline = (): PageElement => cy.get('.moj-timeline')

  timelineItems = (): PageElement => cy.get('.moj-timeline__item')

  contactHistoryTableColumnHeaders = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__header[scope=col]').contains(columnHeaderText)

  contactHistoryTableRowHeaders = (rowHeaderText: string): PageElement =>
    cy.get('.govuk-table__header[scope=row]').contains(rowHeaderText)
}
