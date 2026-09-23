import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

import SummaryListComponent from './components/summaryListComponent'

export default class AlcoholMonitoringOrderDetailsPage extends AppPage {
  readonly deviceWearer: SummaryListComponent

  readonly order: SummaryListComponent

  readonly subNavigation: Locator

  constructor(page: Page) {
    super(page, 'Alcohol monitoring order', paths.ALCOHOL_MONITORING.DETAILS)

    this.deviceWearer = new SummaryListComponent(page, 'Device wearer')
    this.order = new SummaryListComponent(page, 'Order details')

    this.subNavigation = page.locator('.moj-sub-navigation')
  }

  subNavigationLink(buttonText: string): Locator {
    return this.subNavigation.getByRole('link', { name: buttonText, exact: true })
  }
}
