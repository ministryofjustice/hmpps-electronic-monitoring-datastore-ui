import Page, { PageElement } from '../page'

export default class CurfewTimetablePage extends Page {
  constructor() {
    super('Services')
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
}
