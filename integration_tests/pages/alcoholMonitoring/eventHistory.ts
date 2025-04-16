import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'
import TimelineComponent from '../components/timelineComponent'

export default class EventHistoryPage extends AppPage {
  constructor() {
    super('All event history', paths.ALCOHOL_MONITORING.EVENT_HISTORY)
  }

  get serviceInformation(): PageElement {
    return cy.contains('This service gives you access to all order data that was held by Capita and G4S')
  }

  get timeline(): TimelineComponent {
    return new TimelineComponent()
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
}
