import Page from './page'
import PageElement from './PageElement'

import PageHeaderComponent from '../components/pageHeaderComponent'

export default class AppPage extends Page {
  header = new PageHeaderComponent()

  constructor(title: string, uri?: string | RegExp, subtitle?: string) {
    super(title, uri, subtitle)
  }

  get backButton(): PageElement {
    return cy.contains('Back')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.header.checkHasHeader()
  }
}
