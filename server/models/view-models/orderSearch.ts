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

export const createErrorSummary = (validationErrors: ValidationResult): ErrorSummary | null => {
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
  construct(formData: OrderSearchCriteria, errors?: ValidationResult): OrderSearchView {
    return constructFromFormData(formData, errors)
  },
}

const constructFromFormData = (
  formData: OrderSearchCriteria,
  validationErrors: ValidationResult = [],
): OrderSearchView => {
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
        day: formData['dob-day'],
        month: formData['dob-month'],
        year: formData['dob-year'],
      },
      error:
        getError(validationErrors, 'dob') ||
        getError(validationErrors, 'dob-day') ||
        getError(validationErrors, 'dob-month') ||
        getError(validationErrors, 'dob-year'),
    },
    errorSummary: createErrorSummary(validationErrors),
  }
}
