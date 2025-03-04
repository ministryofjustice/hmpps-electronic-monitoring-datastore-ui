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
      ? {
          value: formData.searchType,
          ...getError(validationErrors, 'searchType'),
        }
      : undefined,
    legacySubjectId: formData.legacySubjectId
      ? {
          value: formData.legacySubjectId,
          ...getError(validationErrors, 'legacySubjectId'),
        }
      : undefined,
    firstName: formData.firstName
      ? {
          value: formData.firstName,
          ...getError(validationErrors, 'firstName'),
        }
      : undefined,
    lastName: formData.lastName
      ? {
          value: formData.lastName,
          ...getError(validationErrors, 'lastName'),
        }
      : undefined,
    alias: formData.alias
      ? {
          value: formData.alias,
          ...getError(validationErrors, 'alias'),
        }
      : undefined,
    dob: {
      value: {
        day: formData.dobDay || '',
        month: formData.dobMonth || '',
        year: formData.dobYear || '',
      },
      ...getError(validationErrors, 'dob'),
    },
    emptyFormError: getError(validationErrors, 'emptyForm')?.error || undefined,
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
