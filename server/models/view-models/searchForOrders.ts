import { ParsedSearchFormData } from '../form-data/searchOrder'
import { DateField, ErrorMessage, getError, TextField } from '../utils'
import { ValidationResult } from '../Validation'

type SearchForOrdersViewModel = {
  searchType?: TextField
  legacySubjectId?: TextField
  firstName?: TextField
  lastName?: TextField
  alias?: TextField
  dob: DateField
  emptyFormError?: ErrorMessage
}

const createViewModelFromFormData = (
  formData: ParsedSearchFormData,
  validationErrors: ValidationResult,
): SearchForOrdersViewModel => {
  return {
    searchType: formData.searchType
      ? { value: formData.searchType, error: getError(validationErrors, 'searchType') }
      : undefined,
    legacySubjectId: formData.legacySubjectId
      ? { value: formData.legacySubjectId, error: getError(validationErrors, 'legacySubjectId') }
      : undefined,
    firstName: formData.firstName
      ? { value: formData.firstName, error: getError(validationErrors, 'firstName') }
      : undefined,
    lastName: formData.lastName
      ? { value: formData.lastName, error: getError(validationErrors, 'lastName') }
      : undefined,
    alias: formData.alias ? { value: formData.alias, error: getError(validationErrors, 'alias') } : undefined,
    dob: {
      value: {
        day: formData.dobDay || '',
        month: formData.dobMonth || '',
        year: formData.dobYear || '',
      },
      error: getError(validationErrors, 'dob'),
    },
    emptyFormError: getError(validationErrors, 'emptyForm') || undefined,
  }
}

const construct = (
  formData: ParsedSearchFormData = {} as ParsedSearchFormData,
  validationErrors: ValidationResult = [],
): SearchForOrdersViewModel => {
  return createViewModelFromFormData(formData, validationErrors)
}

export default {
  construct,
}
