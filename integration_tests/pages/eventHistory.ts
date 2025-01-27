import Page, { PageElement } from './page'

export default class EventHistoryPage extends Page {
  constructor() {
    super('All event history')
  }

  timeline = (): PageElement => cy.get('.moj-timeline')

  timelineItems = (): PageElement => cy.get('.moj-timeline__item')

  events = (): PageElement => cy.get('.govuk-summary-list')
}
