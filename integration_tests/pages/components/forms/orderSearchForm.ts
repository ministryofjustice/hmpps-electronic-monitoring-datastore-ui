import { PageElement } from '../../page'
import FormComponent from '../formComponent'
import FormDateComponent from '../formDateComponent'
import FormInputComponent from '../formInputComponent'
import FormRadiosComponent from '../formRadiosComponent'

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

  get orderTypeField(): FormRadiosComponent {
    const label = 'Order type'
    return new FormRadiosComponent(this.form, label, ['Integrity', 'Alcohol monitoring'])
  }

  get legacySubjectIdField(): FormInputComponent {
    const label = 'Legacy subject id'
    return new FormInputComponent(this.form, label)
  }

  get firstNameField(): FormInputComponent {
    const label = 'First name'
    return new FormInputComponent(this.form, label)
  }

  get lastNameField(): FormInputComponent {
    const label = 'Last name'
    return new FormInputComponent(this.form, label)
  }

  get aliasField(): FormInputComponent {
    const label = 'Alias'
    return new FormInputComponent(this.form, label)
  }

  get dateOfBirthField(): FormDateComponent {
    const label = 'Date of birth'
    return new FormDateComponent(this.form, label)
  }

  // ACTIONS

  get searchButton(): PageElement {
    return this.form.contains('Search')
  }

  // FORM HELPERS

  fillInWith = (criteria: OrderSearchFormData): undefined => {
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

  shouldBeValid(): void {
    this.orderTypeField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.orderTypeField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.orderTypeField.shouldNotBeDisabled()
  }
}
