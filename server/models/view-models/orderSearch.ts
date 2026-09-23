import z, { ZodError } from 'zod'

import { getError } from '../../utils/utils'

import { OrderSearchCriteria } from '../requests/OrderSearchRequest'
import { ValidationError, ValidationResult } from '../validationResult'
import { Date, ViewModel, ErrorSummary, ErrorListItem } from './utils'

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

export const createErrorSummary = (validationErrors: ValidationResult = []): ErrorSummary | null => {
  if (validationErrors.length === 0) {
    return null
  }
  return {
    title: 'There is a problem',
    errorList: validationErrors.map(issue => {
      return {
        field: issue.field,
        message: issue.error,
      } as ErrorListItem
    }),
  }
}

export type OrderSearchView = ViewModel<{
  searchType: 'integrity' | 'alcohol-monitoring'
  legacySubjectId: string
  firstName: string
  lastName: string
  alias: string
  dateOfBirth: Date
}>
export const OrderSearchView = {
  construct(formData: OrderSearchCriteria, validationErrors?: ValidationResult): OrderSearchView {
    return {
      searchType: {
        value: formData.searchType,
        error: getError('searchType', validationErrors),
      },
      legacySubjectId: {
        value: formData.legacySubjectId,
        error: getError('legacySubjectId', validationErrors),
      },
      firstName: {
        value: formData.firstName,
        error: getError('firstName', validationErrors),
      },
      lastName: {
        value: formData.lastName,
        error: getError('lastName', validationErrors),
      },
      alias: {
        value: formData.alias,
        error: getError('alias', validationErrors),
      },
      dateOfBirth: {
        value: {
          day: formData['dob-day'],
          month: formData['dob-month'],
          year: formData['dob-year'],
        },
        error:
          getError('dob', validationErrors) ||
          getError('dob-day', validationErrors) ||
          getError('dob-month', validationErrors) ||
          getError('dob-year', validationErrors),
      },
      errorSummary: createErrorSummary(validationErrors),
    }
  },
}
