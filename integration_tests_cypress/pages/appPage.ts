import Page from './page'
import PageElement from './PageElement'

import PageHeaderComponent from './components/pageHeaderComponent'

export default class AppPage extends Page {
  header = new PageHeaderComponent()

  constructor(title: string, uri?: string | RegExp, subtitle?: string) {
    super(title, uri, subtitle)
  }

  get backButton(): PageElement {
    return cy.contains('Back')
  }

  get serviceInformation(): PageElement {
    return cy.contains('This service gives you access to all order data that was held by Capita and G4S')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.header.checkHasHeader()
  }
}
