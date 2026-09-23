import { type Page } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppPage from './appPage'

export default class StartPage extends AppPage {
  constructor(page: Page) {
    super(page, 'Electronic Monitoring Datastore', paths.START)
  }
}
