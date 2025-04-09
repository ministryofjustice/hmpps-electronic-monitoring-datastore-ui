import AppPage from '../appPage'
import PageElement from '../PageElement'
import SearchResultsComponent from '../components/searchResultsComponent'
import PaginationComponent from '../components/paginationComponent'
import paths from '../../../server/constants/paths'

export default class IntegritySearchResultsPage extends AppPage {
  constructor() {
    super('Search results', paths.INTEGRITY_ORDER.INDEX)
  }

  get returnToSearchButton(): PageElement {
    return cy.contains('Return to search page')
  }

  get serviceInformation(): PageElement {
    return cy.contains('This service gives you access to all order data that was held by Capita and G4S')
  }

  get backButton(): PageElement {
    return cy.contains('back to search form')
  }

  get results(): SearchResultsComponent {
    return new SearchResultsComponent()
  }

  get pagination(): PaginationComponent {
    return new PaginationComponent()
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
}
