import { type Page } from 'playwright-core'

import AppPage from './appPage'

export default class errorPage extends AppPage {
  constructor(page: Page, errorMessage: string, uri?: string) {
    super(page, errorMessage, uri || /\/*/)
  }
}
