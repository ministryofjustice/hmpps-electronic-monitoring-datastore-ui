import Page, { PageElement } from './page'

export default class VisitDetailsPage extends Page {
  constructor() {
    super('Visit details')
  }

  timeline = (): PageElement => cy.get('.moj-timeline')

  timelineItems = (): PageElement => cy.get('.moj-timeline__item')

  details = (): PageElement => cy.get('.govuk-details')

  detailsSummary = (): PageElement => cy.get('.govuk-details__summary')

  firstTable = (): PageElement => cy.get('#first-table')

  secondTable = (): PageElement => cy.get('#second-table')

  firstTableBody = (): PageElement => cy.get('#first-table-body')

  secondTableBody = (): PageElement => cy.get('#second-table-body')

  visitDetailsTableColumnHeaders = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__header[scope=col]').contains(columnHeaderText)

  visitDetailsTableRowHeaders = (rowHeaderText: string): PageElement =>
    cy.get('.govuk-table__row').children('.govuk-table__cell[scope=row]').contains(rowHeaderText)
}
