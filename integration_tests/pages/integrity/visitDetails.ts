import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'

export default class VisitDetailsPage extends AppPage {
  constructor() {
    super('Visit details', paths.INTEGRITY_ORDER.VISIT_DETAILS)
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
}
