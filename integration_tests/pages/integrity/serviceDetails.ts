import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'

export default class ServiceDetailsPage extends AppPage {
  constructor() {
    super('Services', paths.INTEGRITY_ORDER.SERVICE_DETAILS)
  }

  get serviceDetails(): PageElement {
    return cy.get('.moj-timeline')
  }

  get serviceDetailsItems(): PageElement {
    return cy.get('.moj-timeline').find('.moj-timeline__item')
  }

  getServiceDetailsItem(index: number): PageElement {
    return cy.get('.moj-timeline').find('.moj-timeline__item').eq(index)
  }

  get noResultsHeading(): PageElement {
    return cy.get('.no-results-heading')
  }

  get noResultsMessage(): PageElement {
    return cy.get('.no-results-message')
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
}
