import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

import SummaryListComponent from './components/summaryListComponent'

export default class IntegritySuspensionOfVisitsHistoryPage extends AppPage {
  readonly suspensionOfVisitsHistory: SummaryListComponent

  readonly subNavigation: Locator

  constructor(page: Page) {
    super(page, 'Suspension of visits', paths.INTEGRITY_ORDER.SUSPENSION_OF_VISITS_HISTORY)

    this.suspensionOfVisitsHistory = new SummaryListComponent(page, 'Suspension of visits history')

    this.subNavigation = page.locator('.moj-sub-navigation')
  }

  async subNavigationLink(buttonText: string) {
    return this.subNavigation.locator('.moj-sub-navigation__link', { hasText: buttonText })
  }
}
