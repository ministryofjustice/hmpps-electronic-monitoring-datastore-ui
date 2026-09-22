import type { Locator } from '@playwright/test'
import type { Page } from 'playwright-core'

import FormComponent from './formComponent'
import TextInputComponent from './textInputComponent'
import DateInputComponent from './dateInputComponent'
import RadiosComponent from './radiosComponent'

export type OrderSearchFormData = {
  orderType: string
  legacySubjectId?: string
  firstName?: string
  lastName?: string
  alias?: string
  dateOfBirth?: Date
}

export default class OrderSearchFormComponent extends FormComponent {
  // FIELDS

  readonly orderType: RadiosComponent

  readonly legacySubjectId: TextInputComponent

  readonly firstName: TextInputComponent

  readonly lastName: TextInputComponent

  readonly alias: TextInputComponent

  readonly dateOfBirth: DateInputComponent

  readonly searchButton: Locator

  constructor(page: Page) {
    super(page)

    this.orderType = new RadiosComponent(this.element, 'What data are you searching for?')

    this.legacySubjectId = new TextInputComponent(this.element, 'Legacy subject id')
    this.firstName = new TextInputComponent(this.element, 'First name')
    this.lastName = new TextInputComponent(this.element, 'Last name')
    this.alias = new TextInputComponent(this.element, 'Alias')
    this.dateOfBirth = new DateInputComponent(this.element, 'Date of birth')

    this.searchButton = this.element.getByRole('button', { name: 'Search' })
  }

  // FORM HELPERS

  fill = (criteria: OrderSearchFormData): undefined => {
    if (criteria.orderType) {
      this.orderType.check(criteria.orderType)
    }

    if (criteria.legacySubjectId) {
      this.legacySubjectId.fill(criteria.legacySubjectId)
    }

    if (criteria.firstName) {
      this.firstName.fill(criteria.firstName)
    }

    if (criteria.lastName) {
      this.lastName.fill(criteria.lastName)
    }

    if (criteria.alias) {
      this.alias.fill(criteria.alias)
    }

    if (criteria.dateOfBirth) {
      this.dateOfBirth.fill(
        criteria.dateOfBirth.getDate(),
        criteria.dateOfBirth.getMonth() + 1,
        criteria.dateOfBirth.getFullYear(),
      )
    }
  }

  /*
  isValid(): boolean {
    this.orderType.shouldNotHaveValidationMessage()
  }
  */
}
