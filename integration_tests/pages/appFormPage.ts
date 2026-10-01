import { type Page } from '@playwright/test'

import AppPage from './appPage'

import FormComponent from './components/formComponent'
import ErrorSummaryComponent from './components/errorSummaryComponent'

export default class AppFormPage<T extends FormComponent> extends AppPage {
  protected formComponent: T | undefined

  readonly errorSummary: ErrorSummaryComponent

  constructor(page: Page, title: string, uri?: string | RegExp, subtitle?: string) {
    super(page, title, uri, subtitle)

    this.errorSummary = new ErrorSummaryComponent(this.page)
  }

  get form(): T {
    return this.formComponent!
  }
}
