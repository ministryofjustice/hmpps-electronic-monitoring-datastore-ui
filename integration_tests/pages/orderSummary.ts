import Page, { PageElement } from './page'

export default class OrderSummaryPage extends Page {
  constructor() {
    super('Key order details')
  }

  override checkOnPage(): void {
    cy.get('caption').contains('Key order details')
  }

  orderDetailsTable = (): PageElement => cy.get('.govuk-table__body')

  legacySubjectId = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Legacy subject ID')

  name = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Name')

  alias = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Alias')

  dateOfBirth = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Date of birth')

  postcode = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Postcode')

  address = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Address')

  tagType = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Tag type')

  startDate = (): PageElement => cy.get('.govuk-table__row').children('th').contains('Start date')

  endDate = (): PageElement => cy.get('.govuk-table__row').children('th').contains('End date')

  orderDetailsButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Order details')

  visitsAndTasksButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Visits and tasks')

  eventHistoryButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Event history')

  equipmentDetailsButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Equipment details')

  curfewHoursButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Curfew hours')

  curfewViolationsButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Curfew violations')

  contactHistoryButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Contact history')

  suspensionsButton = (): PageElement => cy.get('.ems-button-grid__button').contains('Suspensions')

  dateFilter = (): PageElement => cy.get('.ems-date-filter')

  dateFilterRow = (): PageElement => cy.get('.ems-date-filter__input-row')

  clearFilterLink = (): PageElement => cy.get('.ems-date-filter__clear-filter-button')

  applyButton = (): PageElement => cy.get('.ems-date-filter__filter-button')

  clearFilterButton = (): PageElement => cy.get('.ems-date-filter__filter-button')

  tabsList = (): PageElement => cy.get('.govuk-tabs__list')

  orderDocumentsTab = (): PageElement => cy.get('.govuk-tabs__tab').contains('Order documents')

  variationsTab = (): PageElement => cy.get('.govuk-tabs__tab').contains('Variations')

  enforcementsTab = (): PageElement => cy.get('.govuk-tabs__tab').contains('Enforcements')

  visitReportsTab = (): PageElement => cy.get('.govuk-tabs__tab').contains('Visit reports')

  orderDocumentsPanel = (): PageElement => cy.get('#order-documents')

  variationsPanel = (): PageElement => cy.get('#variations')
}
