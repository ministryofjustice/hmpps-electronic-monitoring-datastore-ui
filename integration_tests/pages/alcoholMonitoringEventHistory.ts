import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

import TimelineComponent from './components/timelineComponent'

export default class AlcoholMonitoringEventHistoryPage extends AppPage {
  readonly eventHistory: TimelineComponent

  readonly subNavigation: Locator

  constructor(page: Page) {
    super(page, 'Events', paths.ALCOHOL_MONITORING.EVENT_HISTORY)

    this.eventHistory = new TimelineComponent(page)

    this.subNavigation = page.locator('.moj-sub-navigation')
  }

  subNavigationLink(buttonText: string): Locator {
    return this.subNavigation.getByRole('link', { name: buttonText, exact: true })
  }
}
