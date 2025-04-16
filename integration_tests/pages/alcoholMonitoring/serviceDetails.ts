import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'
import TimelineComponent from '../components/timelineComponent'

export default class ServiceDetailsPage extends AppPage {
  constructor() {
    super('Services', paths.ALCOHOL_MONITORING.SERVICE_DETAILS)
  }

  get serviceInformation(): PageElement {
    return cy.contains('This service gives you access to all order data that was held by Capita and G4S')
  }

  get timeline(): TimelineComponent {
    return new TimelineComponent()
  }

  get noResultsHeading(): PageElement {
    return cy.get('.no-results-heading')
  }

  get noResultsMessage(): PageElement {
    return cy.get('.no-results-message')
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
}
