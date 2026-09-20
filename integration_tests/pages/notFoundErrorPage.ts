import { type Page } from 'playwright-core'

import AppPage from './appPage'

export default class NotFoundErrorPage extends AppPage {
  constructor(page: Page, errorMessage: string = 'Page not found', uri?: string) {
    super(page, errorMessage, uri || /\/*'/)
  }
}
