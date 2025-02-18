import Page, { PageElement } from './page'

export default class SearchResultsPage extends Page {
  constructor() {
    super('Search results')
  }

  override checkOnPage(): void {
    cy.get('caption').contains('Search results')
  }

  serviceInformation = (): PageElement => cy.get('.service-information')

  serviceInformationText = (): PageElement => cy.get('.service-information').children('.govuk-warning-text__text')

  resultsTable = (): PageElement => cy.get('.search-results-table')

  subjectIdHeader = (): PageElement => cy.get('.subject-id-header')

  nameHeader = (): PageElement => cy.get('.name-header')

  dateOfBirthHeader = (): PageElement => cy.get('.date-of-birth-header')

  orderStartDateHeader = (): PageElement => cy.get('.order-start-date-header')

  orderEndDateHeader = (): PageElement => cy.get('.order-end-date-header')

  pagination = (): PageElement => cy.get('.moj-pagination')
}
