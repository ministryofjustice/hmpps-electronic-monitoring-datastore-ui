import type { Locator } from '@playwright/test'
import type { Page } from 'playwright-core'

import FormComponent from './formComponent'
import FormInputComponent from './formInputComponent'
import FormDateComponent from './formDateComponent'

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

  readonly orderType: Locator

  readonly legacySubjectId: FormInputComponent

  readonly firstName: FormInputComponent

  readonly lastName: FormInputComponent

  readonly alias: FormInputComponent

  readonly dateOfBirth: FormDateComponent

  readonly searchButton: Locator

  constructor(page: Page) {
    super(page)

    this.orderType = this.element.getByRole('radio', { name: 'Order type' })

    this.legacySubjectId = new FormInputComponent(this.element, 'Legacy subject id')
    this.firstName = new FormInputComponent(this.element, 'First name')
    this.lastName = new FormInputComponent(this.element, 'Last name')
    this.alias = new FormInputComponent(this.element, 'Alias')
    this.dateOfBirth = new FormDateComponent(this.element, 'Date of birth')

    this.searchButton = this.element.getByRole('button', { name: 'Search' })
  }

  // FORM HELPERS

  /*
  fill = (criteria: OrderSearchFormData): undefined => {
    if (criteria.orderType) {
      this.orderTypeField.set(criteria.orderType)
    }

    if (criteria.legacySubjectId) {
      this.legacySubjectIdField.set(criteria.legacySubjectId)
    }

    if (criteria.firstName) {
      this.firstNameField.set(criteria.firstName)
    }

    if (criteria.lastName) {
      this.lastNameField.set(criteria.lastName)
    }

    if (criteria.alias) {
      this.aliasField.set(criteria.alias)
    }

    if (criteria.dateOfBirth) {
      this.dateOfBirthField.set(criteria.dateOfBirth)
    }
  }
  */

  /*
  isValid(): boolean {
    this.orderTypeField.shouldNotHaveValidationMessage()
  }
  */
}
