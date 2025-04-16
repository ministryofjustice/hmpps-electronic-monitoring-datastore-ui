import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'
import TimelineComponent from '../components/timelineComponent'

export default class VisitDetailsPage extends AppPage {
  constructor() {
    super('Visit details', paths.ALCOHOL_MONITORING.VISIT_DETAILS)
  }

  get serviceInformation(): PageElement {
    return cy.contains('This service gives you access to all order data that was held by Capita and G4S')
  }

  get timeline(): TimelineComponent {
    return new TimelineComponent()
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
}
