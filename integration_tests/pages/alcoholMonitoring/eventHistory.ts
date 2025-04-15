import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'

export default class EventHistoryPage extends AppPage {
  constructor() {
    super('All event history', paths.ALCOHOL_MONITORING.EVENT_HISTORY)
  }

  get timeline(): PageElement {
    return cy.get('.moj-timeline')
  }

  get timelineItems(): PageElement {
    return cy.get('.moj-timeline').find('.moj-timeline__item')
  }

  getTimelineItem(index: number): PageElement {
    return cy.get('.moj-timeline').find('.moj-timeline__item').eq(index)
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
}
