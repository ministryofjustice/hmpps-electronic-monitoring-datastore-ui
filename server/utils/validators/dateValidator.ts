import { z } from 'zod'
import strings from '../../constants/strings' // Ensure this path is correctly pointing to your strings constants

// Exporting constants for date validation
export const MIN_YEAR: number = 1900
export const LAST_HISTORICAL_DATE: number = 2023

const dateModel = z.object({
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(MIN_YEAR).max(LAST_HISTORICAL_DATE),
})

export type DateValidationResponse = {
  result: boolean
  error?: {
    field: string
    error: string
  }
}

export class DateValidator {
  static validateDate(dayStr: string, monthStr: string, yearStr: string, field: string): DateValidationResponse {
    if (this.isEmpty(dayStr) && this.isEmpty(monthStr) && this.isEmpty(yearStr)) {
      return { result: true } // All fields are empty, considered valid for optional use
    }

    if (this.isEmpty(dayStr) || this.isEmpty(monthStr) || this.isEmpty(yearStr)) {
      return {
        result: false,
        error: {
          field,
          error: strings.errors.incompleteDate,
        },
      }
    }

    const day = this.parseNumber(dayStr)
    const month = this.parseNumber(monthStr)
    const year = this.parseNumber(yearStr)

    try {
      const currentDate = new Date()
      const inputDate = new Date(year, month, day)
      if (inputDate > currentDate) {
        return { result: false, error: { field, error: strings.errors.futureDateNotAllowed } }
      }
      dateModel.parse({ day, month, year })
      return { result: true }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        result: false,
        error: { field, error: strings.errors.incorrectDateFormat },
      }
    }
  }

  private static isEmpty(value: string): boolean {
    return value.trim().length === 0
  }

  // Optionally export this if you plan to use it outside the class
  public static parseNumber(value: string): number {
    return value ? parseInt(value, 10) : NaN
  }
}
