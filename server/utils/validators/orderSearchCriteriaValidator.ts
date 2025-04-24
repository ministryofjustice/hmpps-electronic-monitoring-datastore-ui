import { ZodTypeAny } from 'zod'
import { ParsedSearchFormData } from '../../models/form-data/searchOrder'
import { ValidationResult } from '../../models/Validation'
import { SearchFormInput } from '../../types/Search'
import DateValidator from './dateValidator'
import NameValidator from './nameValidator'

export default class OrderSearchCriteriaValidator {
  static isEmptySearch(searchData: ParsedSearchFormData): boolean {
    const { searchType, ...mandatoryFields } = searchData
    return Object.values(mandatoryFields).every(value => value === '' || value === undefined)
  }

  static validateInput(data: ParsedSearchFormData): ValidationResult {
    const validationErrors: ValidationResult = []

    if (this.isEmptySearch(data)) {
      validationErrors.push({
        field: 'emptyForm',
        error: 'You must enter a value into at least one search field',
      })
      return validationErrors
    }

    const parsedDateOfBirth = DateValidator.dob.parse({
      day: data.dobDay,
      month: data.dobMonth,
      year: data.dobYear,
    })
    if (!parsedDateOfBirth.isValid) {
      validationErrors.push(parsedDateOfBirth.error!)
    }

    ;['firstName', 'lastName', 'alias'].forEach(field => {
      const fieldValue = data[field as keyof SearchFormInput['data']]
      const validator = NameValidator[field as keyof typeof NameValidator] as ZodTypeAny

      const validationResult = validator.safeParse(fieldValue)

      if (!validationResult.success) {
        validationErrors.push({
          field,
          error: validationResult.error.issues[0].message,
        })
      }
    })

    return validationErrors
  }
}
