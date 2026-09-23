import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

export default class IntegritySearchResultsPage extends AppPage {
  readonly returnToSearchButton: Locator

  readonly backLink: Locator

  readonly orderSearchResults: Locator

  readonly noResults: Locator

  constructor(page: Page) {
    super(page, 'Integrity orders', paths.INTEGRITY_ORDER.INDEX)

    this.orderSearchResults = page.locator('.order-search-results__list')
    this.noResults = page.locator('.order-search-results__no-results')

    this.returnToSearchButton = page.getByRole('button', { name: 'Return to search' })
    this.backLink = page.getByRole('link', { name: 'Back to search' })
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
