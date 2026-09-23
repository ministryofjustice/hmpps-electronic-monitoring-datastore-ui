import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

import SummaryListComponent from './components/summaryListComponent'

export default class IntegrityOrderSummaryPage extends AppPage {
  readonly orderSummary: SummaryListComponent

  readonly subNavigation: Locator

  constructor(page: Page) {
    super(page, 'Integrity order', paths.INTEGRITY_ORDER.SUMMARY)

    this.orderSummary = new SummaryListComponent(page, 'Order summary')

    this.subNavigation = page.locator('.moj-sub-navigation')
  }

  subNavigationLink(buttonText: string): Locator {
    return this.subNavigation.getByRole('link', { name: buttonText, exact: true })
  }
}
