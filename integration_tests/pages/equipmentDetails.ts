import Page, { PageElement } from './page'

export default class CurfewHoursPage extends Page {
  constructor() {
    super('Equipment details')
  }

  equipmentDetailsTable = (): PageElement => cy.get('.govuk-table__body')

  equipmentDetailsColumnHeaders = (columnHeaderText: string): PageElement =>
    cy.get('.govuk-table__row').contains(columnHeaderText)

  equipmentDetailsRowHeaders = (rowHeaderText: string): PageElement =>
    cy.get('.govuk-table__row').contains(rowHeaderText)
}
