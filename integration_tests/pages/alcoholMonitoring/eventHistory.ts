import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'
import TimelineComponent from '../components/timelineComponent'

export default class EventHistoryPage extends AppPage {
  constructor() {
    super('All event history', paths.ALCOHOL_MONITORING.EVENT_HISTORY)
  }

  get timeline(): TimelineComponent {
    return new TimelineComponent()
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
}
