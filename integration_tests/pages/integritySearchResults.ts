import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

export default class IntegritySearchResultsPage extends AppPage {
  readonly returnToSearchButton: Locator

  readonly backButton: Locator

  constructor(page: Page) {
    super(page, 'Search results', paths.INTEGRITY_ORDER.INDEX)

    this.returnToSearchButton = page.getByRole('button', { name: 'Return to search page' })

    this.backButton = page.getByRole('button', { name: 'Back to search form' })
  }

  /*
  get results(): SearchResultsComponent {
    return new SearchResultsComponent()
  }

  get pagination(): PaginationComponent {
    return new PaginationComponent()
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
  */
}
