import type { Page } from '@playwright/test'

import AppPage from './appPage'

import FormComponent from './components/formComponent'
import ErrorSummaryComponent from './components/errorSummaryComponent'

export default class AppFormPage extends AppPage {
  protected formComponent: FormComponent | undefined

  readonly errorSummary: ErrorSummaryComponent

  constructor(page: Page, title: string, uri?: string | RegExp, subtitle?: string) {
    super(page, title, uri, subtitle)

    this.errorSummary = new ErrorSummaryComponent(this.page)
  }

  get form() {
    return this.formComponent
  }

  async checkOnPage(): Promise<void> {
    await super.checkOnPage()

    if (this.formComponent) {
      await this.formComponent.checkHasForm()
    }
  }
}
