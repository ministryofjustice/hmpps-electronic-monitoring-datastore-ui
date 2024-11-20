import Page, { PageElement } from './page'

export default class SuspensionOfVisitsPage extends Page {
  constructor() {
    super('Suspension of visits')
  }

  timeline = (): PageElement => cy.get('.moj-timeline')

  timelineItems = (): PageElement => cy.get('.moj-timeline__item')

  details = (): PageElement => cy.get('.govuk-details')

  detailsSummary = (): PageElement => cy.get('.govuk-details__summary')

  table = (): PageElement => cy.get('.govuk-table')

  tableBody = (): PageElement => cy.get('.govuk-table__body')

  suspensionsTableColumnHeaders = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__header[scope=col]').contains(columnHeaderText)

  suspensionsTableRowHeaders = (rowHeaderText: string): PageElement =>
    cy.get('.govuk-table__row').children('.govuk-table__cell[scope=row]').contains(rowHeaderText)
}
