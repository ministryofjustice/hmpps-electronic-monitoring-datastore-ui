import Page, { PageElement } from './page'

export default class SuspensionOfVisitsPage extends Page {
  constructor() {
    super('Suspension of visits')
  }

  timeline = (): PageElement => cy.get('.moj-timeline')

  timelineItems = (): PageElement => cy.get('.moj-timeline__item')

  itemTableHeaders = (headerText: string): PageElement => cy.get('.govuk-summary-list__key').contains(headerText)
}
