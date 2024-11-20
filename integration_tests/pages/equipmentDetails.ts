import Page, { PageElement } from './page'

export default class CurfewHoursPage extends Page {
  constructor() {
    super('Equipment details')
  }

  hmuTable = (): PageElement => cy.get('.govuk-table').contains('.govuk-table__caption', 'HMU').parents('.govuk-table')

  deviceTable = (): PageElement =>
    cy.get('.govuk-table').contains('.govuk-table__caption', 'Device').parents('.govuk-table')

  hmuTableCaption = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__caption').contains(columnHeaderText)

  deviceTableCaption = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__caption').contains(columnHeaderText)

  hmuRowHeaders = (rowHeaderText: string): PageElement =>
    cy.get('.govuk-table__row').children('.govuk-table__cell').contains(rowHeaderText)

  deviceRowHeaders = (rowHeaderText: string): PageElement =>
    cy.get('.govuk-table__row').children('.govuk-table__cell').contains(rowHeaderText)
}
