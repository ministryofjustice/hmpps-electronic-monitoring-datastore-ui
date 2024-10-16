import Page, { PageElement } from './page'

export default class OrderSummaryPage extends Page {
  constructor() {
    super('Key order details')
  }

  override checkOnPage(): void {
    cy.get('caption').contains('Key order details')
  }

  legacySubjectId = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Legacy subject ID')

  name = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Name')

  alias = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Alias')

  dateOfBirth = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Date of birth')

  postcode = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Postcode')

  address = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Address')

  tagType = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Tag type')

  endDate = (): PageElement => cy.get('.govuk-table__row').children('th').contains('End date')

  orderDetailsButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Order details')

  visitsAndTasksButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Visits and tasks')

  eventHistoryButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Event history')

  equipmentDetailsButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Equipment details')

  curfewHoursButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Curfew hours')

  curfewViolationsButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Curfew violations')

  contactHistoryButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Contact history')

  suspensionsButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Suspensions')
}
