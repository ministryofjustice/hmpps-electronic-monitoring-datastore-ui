import AppPage from '../../appPage'
import PageElement from '../../PageElement'
import paths from '../../../../server/constants/paths'

export default class CurfewTimetablePage extends AppPage {
  constructor() {
    super('Services', paths.INTEGRITY_ORDER.CURFEW_TIMETABLE)
  }

  get curfewTimetable(): PageElement {
    return cy.get('.moj-timeline')
  }

  get curfewTimetableItems(): PageElement {
    return cy.get('.moj-timeline').find('.moj-timeline__item')
  }

  getCurfewTimetableItem(index: number): PageElement {
    return cy.get('.moj-timeline').find('.moj-timeline__item').eq(index)
  }

  get noResultsHeading(): PageElement {
    return cy.get('.no-results-heading')
  }

  get noResultsMessage(): PageElement {
    return cy.get('.no-results-message')
  }
}
