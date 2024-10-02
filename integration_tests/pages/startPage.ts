import Page, { PageElement } from './page'

export default class StartPage extends Page {
  constructor() {
    super('Electronic Monitoring Datastore')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')
}