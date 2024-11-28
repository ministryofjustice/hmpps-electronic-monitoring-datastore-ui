import { SearchOrderFormData } from '../form-data/searchOrder'
import { DateField, getError, TextField } from '../utils'
import { ValidationResult } from '../Validation'

type SearchForOrdersViewModel = {
  searchType?: TextField
  legacySubjectId?: TextField
  firstName?: TextField
  lastName?: TextField
  alias?: TextField
  dob: DateField
}

const createViewModelFromFormData = (
  formData: SearchOrderFormData,
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
        day: formData['dob-day'] || '',
        month: formData['dob-month'] || '',
        year: formData['dob-year'] || '',
      },
      error: getError(validationErrors, 'dob'),
    },
  }
}

const construct = (
  formData: [SearchOrderFormData] | [] = [],
  validationErrors: ValidationResult = [],
): SearchForOrdersViewModel => {
  if (validationErrors.length > 0 && formData.length > 0) {
    return createViewModelFromFormData(formData[0], validationErrors)
  }

  return createViewModelFromFormData(formData[0], validationErrors)
}

export default {
  construct,
}
