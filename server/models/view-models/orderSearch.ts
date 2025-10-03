import z, { ZodError } from 'zod'

import { getError } from '../../utils/utils'

import { OrderSearchCriteria } from '../requests/SearchOrdersRequest'
import { ValidationError, ValidationResult } from '../validationResult'
import { Date, ViewModel, ErrorSummary } from './utils'

export const convertZodErrorToValidationError = (error: ZodError): ValidationResult => {
  type ZodIssueWithParams = z.core.$ZodIssue & {
    params?: {
      focusPath?: string
    }
  }

  return error.issues.reduce((acc, issue) => {
    const fieldPath = issue.path.join('-').toString()
    const focusPath = (issue as ZodIssueWithParams).params?.focusPath

    const validationError: ValidationError = {
      error: issue.message,
      field: fieldPath,
    }

    if (focusPath) {
      validationError.focusTarget = `${fieldPath}-${focusPath}`
    }

    acc.push(validationError)
    return acc
  }, [] as ValidationResult)
}

export const createErrorSummary = (validationErrors: ValidationResult): ErrorSummary | null => {
  if (validationErrors.length === 0) {
    return null
  }
  return {
    title: 'There is a problem',
    errorList: validationErrors.map(issue => {
      return {
        field: issue.field,
        error: issue.error,
      }
    }),
  }
}

export type OrderSearchView = ViewModel<{
  searchType: string
  legacySubjectId?: string
  firstName?: string
  lastName?: string
  alias?: string
  dateOfBirth?: Date
}>
export const OrderSearchView = {
  construct(formData: OrderSearchCriteria, errors?: ValidationResult): OrderSearchView {
    return constructFromFormData(formData, errors)
  },
}

const constructFromFormData = (formData: OrderSearchCriteria, validationErrors?: ValidationResult): OrderSearchView => {
  if (validationErrors && validationErrors?.length === 0) {
    return {
      searchType: {
        value: formData.searchType,
      },
      legacySubjectId: {
        value: formData.legacySubjectId,
      },
      firstName: {
        value: formData.firstName,
      },
      lastName: {
        value: formData.lastName,
      },
      alias: {
        value: formData.alias,
      },
      dateOfBirth: {
        value: {
          day: formData.dobDay,
          month: formData.dobMonth,
          year: formData.dobYear,
        },
      },
      errorSummary: undefined,
    }
  }

  return {
    searchType: {
      value: formData.searchType,
      error: getError(validationErrors, 'searchType'),
    },
    legacySubjectId: {
      value: formData.legacySubjectId,
      error: getError(validationErrors, 'legacySubjectId'),
    },
    firstName: {
      value: formData.firstName,
      error: getError(validationErrors, 'firstName'),
    },
    lastName: {
      value: formData.lastName,
      error: getError(validationErrors, 'lastName'),
    },
    alias: {
      value: formData.alias,
      error: getError(validationErrors, 'alias'),
    },
    dateOfBirth: {
      value: {
        day: formData.dobDay,
        month: formData.dobMonth,
        year: formData.dobYear,
      },
      error: getError(validationErrors, 'dateOfBirth'),
    },
    errorSummary: createErrorSummary(validationErrors),
  }
}
