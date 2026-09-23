import { type Page, type Locator } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

import SummaryListComponent from './components/summaryListComponent'

export default class AlcoholMonitoringEquipmentHistoryPage extends AppPage {
  readonly equipmentHistory: SummaryListComponent

  readonly subNavigation: Locator

  constructor(page: Page) {
    super(page, 'Equipment', paths.ALCOHOL_MONITORING.EQUIPMENT_HISTORY)

    this.equipmentHistory = new SummaryListComponent(page, 'Equipment history')

    this.subNavigation = page.locator('.moj-sub-navigation')
  }

  subNavigationLink(buttonText: string): Locator {
    return this.subNavigation.getByRole('link', { name: buttonText, exact: true })
  }
}
