import Page, { PageElement } from './page'

export default class SuspensionsPage extends Page {
  constructor() {
    super('Suspension of visits')
  }

  timeline = (): PageElement => cy.get('.moj-timeline')

  timelineItems = (): PageElement => cy.get('.moj-timeline__item')

  suspensionsTableColumnHeaders = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__header[scope=col]').contains(columnHeaderText)

  suspensionsTableRowHeaders = (rowHeaderText: string): PageElement =>
    cy.get('.govuk-table__header[scope=row]').contains(rowHeaderText)
}
