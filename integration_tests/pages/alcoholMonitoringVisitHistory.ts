import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

import TimelineComponent from './components/timelineComponent'

export default class AlcoholMonitoringVisitHistoryPage extends AppPage {
  readonly visitHistory: TimelineComponent

  readonly subNavigation: Locator

  constructor(page: Page) {
    super(page, 'Visits', paths.ALCOHOL_MONITORING.VISITS_HISTORY)

    this.visitHistory = new TimelineComponent(page)

    this.subNavigation = page.locator('.moj-sub-navigation')
  }

  subNavigationLink(buttonText: string): Locator {
    return this.subNavigation.getByRole('link', { name: buttonText, exact: true })
  }
}
