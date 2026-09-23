import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

import SummaryListComponent from './components/summaryListComponent'

export default class IntegrityVisitHistoryPage extends AppPage {
  readonly visitHistory: SummaryListComponent

  readonly subNavigation: Locator

  constructor(page: Page) {
    super(page, 'Visits', paths.INTEGRITY_ORDER.VISIT_HISTORY)

    this.visitHistory = new SummaryListComponent(page, 'Visit history')

    this.subNavigation = page.locator('.moj-sub-navigation')
  }

  async subNavigationLink(buttonText: string) {
    return this.subNavigation.locator('.moj-sub-navigation__link', { hasText: buttonText })
  }
}
