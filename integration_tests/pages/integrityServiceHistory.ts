import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

import TimelineComponent from './components/timelineComponent'

export default class IntegrityServiceHistoryPage extends AppPage {
  readonly serviceHistory: TimelineComponent

  readonly subNavigation: Locator

  constructor(page: Page) {
    super(page, 'Services', paths.INTEGRITY.SERVICE_HISTORY)

    this.serviceHistory = new TimelineComponent(page)

    this.subNavigation = page.locator('.moj-sub-navigation')
  }

  subNavigationLink(buttonText: string): Locator {
    return this.subNavigation.getByRole('link', { name: buttonText, exact: true })
  }
}
