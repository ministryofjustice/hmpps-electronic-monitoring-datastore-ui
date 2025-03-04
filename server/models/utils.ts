import { ValidationResult } from './Validation'

export type ErrorMessage = {
  text: string
}

export type FormField = {
  error?: ErrorMessage
}

export type TextField = FormField & {
  value: string
}

export type Date = {
  day: string
  month: string
  year: string
}

export type DateField = FormField & {
  value: Date
}

export const getError = (validationErrors: ValidationResult, field: string): FormField | undefined => {
  const matchedError = validationErrors.find(e => e.field === field)

  if (matchedError) {
    return {
      error: {
        text: matchedError.error,
      },
    }
  }

  return undefined
}
