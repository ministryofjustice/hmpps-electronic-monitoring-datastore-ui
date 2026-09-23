import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

import SummaryListComponent from './components/summaryListComponent'

export default class IntegrityServiceHistoryPage extends AppPage {
  readonly serviceHistory: SummaryListComponent

  readonly subNavigation: Locator

  constructor(page: Page) {
    super(page, 'Services', paths.INTEGRITY_ORDER.SERVICE_HISTORY)

    this.serviceHistory = new SummaryListComponent(page, 'Service history')

    this.subNavigation = page.locator('.moj-sub-navigation')
  }

  async subNavigationLink(buttonText: string) {
    return this.subNavigation.locator('.moj-sub-navigation__link', { hasText: buttonText })
  }
}
