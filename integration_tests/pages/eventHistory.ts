import Page, { PageElement } from './page'

export default class EventHistoryPage extends Page {
  constructor() {
    super('Event history')
  }

  timeline = (): PageElement => cy.get('.moj-timeline')

  timelineItems = (): PageElement => cy.get('.moj-timeline__item')

  eventTableColumnHeaders = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__header[scope=col]').contains(columnHeaderText)

  eventTableRowHeaders = (rowHeaderText: string): PageElement =>
    cy.get('.govuk-table__header[scope=row]').contains(rowHeaderText)
}
