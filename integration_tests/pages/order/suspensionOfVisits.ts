import Page, { PageElement } from '../page'

export default class SuspensionOfVisitsPage extends Page {
  constructor() {
    super('Suspension of visits')
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
