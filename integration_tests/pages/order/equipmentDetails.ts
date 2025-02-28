import Page, { PageElement } from '../page'

export default class EquipmentDetailsPage extends Page {
  constructor() {
    super('Equipment details')
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

  get noResultsHeading(): PageElement {
    return cy.get('.no-results-heading')
  }

  get noResultsMessage(): PageElement {
    return cy.get('.no-results-message')
  }
}
