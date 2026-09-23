import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

import SummaryListComponent from './components/summaryListComponent'

export default class IntegrityOrderSummaryPage extends AppPage {
  readonly summaryDetails: SummaryListComponent

  readonly subNavigation: Locator

  constructor(page: Page) {
    super(page, 'Key order details', paths.INTEGRITY_ORDER.SUMMARY)

    this.summaryDetails = new SummaryListComponent(page, 'Order information')

    this.subNavigation = page.locator('.moj-sub-navigation')
  }

  async subNavigationLink(buttonText: string) {
    return this.subNavigation.locator('.moj-sub-navigation__link', { hasText: buttonText })
  }
}
