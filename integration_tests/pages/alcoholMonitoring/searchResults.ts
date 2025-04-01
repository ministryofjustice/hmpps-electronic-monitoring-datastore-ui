import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'

export default class AlcoholMonitoringSearchResultsPage extends AppPage {
  constructor() {
    super('Search results', paths.ALCOHOL_MONITORING.INDEX)
  }

  override checkOnPage(): void {
    cy.get('h1').contains('Search results')
  }

  noResultsHeader = (): PageElement => cy.get('.no-results-header')

  noResultsMessage = (): PageElement => cy.get('.no-results-message')

  returnToSearchButton = (): PageElement => cy.get('.return-to-search-button')

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
