import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

import SummaryListComponent from './components/summaryListComponent'

export default class AlcoholMonitoringServiceHistoryPage extends AppPage {
  readonly serviceHistory: SummaryListComponent

  readonly subNavigation: Locator

  constructor(page: Page) {
    super(page, 'Services', paths.ALCOHOL_MONITORING.SERVICE_HISTORY)

    this.serviceHistory = new SummaryListComponent(page, 'Service history')

    this.subNavigation = page.locator('.moj-sub-navigation')
  }

  subNavigationLink(buttonText: string): Locator {
    return this.subNavigation.getByRole('link', { name: buttonText, exact: true })
  }
}
