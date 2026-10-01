import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

import TimelineComponent from './components/timelineComponent'

export default class IntegritySuspensionOfVisitsHistoryPage extends AppPage {
  readonly suspensionOfVisitsHistory: TimelineComponent

  readonly subNavigation: Locator

  constructor(page: Page) {
    super(page, 'Suspension of visits', paths.INTEGRITY.SUSPENSION_OF_VISITS_HISTORY)

    this.suspensionOfVisitsHistory = new TimelineComponent(page)

    this.subNavigation = page.locator('.moj-sub-navigation')
  }

  subNavigationLink(buttonText: string): Locator {
    return this.subNavigation.getByRole('link', { name: buttonText, exact: true })
  }
}
