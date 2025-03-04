import { z } from 'zod'
import strings from '../../constants/strings'

const MIN_YEAR: number = 1900
const MIN_DATE: string = `1st January ${MIN_YEAR}`

export interface DateValidationResponse {
  isValid: boolean
  isoDate?: Date
  error?: {
    field: string
    error: string
  }
}

// Utilities
const monthNames: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
}

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

const isValidDate = (year: number | undefined, month: number | undefined, day: number | undefined): boolean => {
  if (month < 1 || month > 12) return false
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return day > 0 && day <= daysInMonth[month - 1]
}

// Model
const dateModel = z.object({
  day: z.string().optional(),
  month: z.string().optional(),
  year: z.string().optional(),
})

// Validator
export const dateValidator = dateModel.transform((data): DateValidationResponse => {
  const { day, month, year } = data

  let inputDate: Date

  // Convert date string to numbers or null
  const parsedDay = day ? parseInt(day, 10) : null
  const parsedMonth = month ? monthNames[month.toLowerCase()] || parseInt(month, 10) : null
  const parsedYear = year ? parseInt(year, 10) : null

  // Valid condition: All date fields are empty
  if (!parsedDay && !parsedMonth && !parsedYear) {
    return { isValid: true }
  }

  // Invalid condition: Some but not all date fields are populated
  if ((parsedDay || parsedMonth || parsedYear) && !(parsedDay && parsedMonth && parsedYear)) {
    if (!parsedDay)
      return {
        isValid: false,
        error: {
          field: 'dob',
          error: strings.errors.missingDay,
        },
      }
    if (!parsedMonth)
      return {
        isValid: false,
        error: {
          field: 'dob',
          error: strings.errors.missingMonth,
        },
      }
    if (!parsedYear)
      return {
        isValid: false,
        error: {
          field: 'dob',
          error: strings.errors.missingYear,
        },
      }
  }

  // Invalid condition: Year is before the earliest permitted date
  if (parsedYear && parsedYear < MIN_YEAR) {
    return {
      isValid: false,
      error: {
        field: 'dob',
        error: strings.errors.dateBelowLimit + MIN_DATE,
      },
    }
  }

  // Invalid condition: The submitted values do not create a real date
  if (!isValidDate(parsedYear, parsedMonth, parsedDay)) {
    return {
      isValid: false,
      error: {
        field: 'dob',
        error: strings.errors.unrealDate,
      },
    }
  }

  // Invalid condition: Date constructor can't generate a date with the provided values
  try {
    inputDate = new Date(parsedYear, parsedMonth - 1, parsedDay)
  } catch (error) {
    return {
      isValid: false,
      error: {
        field: 'dateOfBirth',
        error: strings.errors.unrealDate,
      },
    }
  }

  // Invalid condition: The submitted date is not in the past
  if (parsedYear && parsedMonth && parsedDay) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (inputDate >= today) {
      return {
        isValid: false,
        error: {
          field: 'dob',
          error: 'The date must be in the past.',
        },
      }
    }
  }

  // Valid condition: Date passes manual validation
  return {
    isValid: true,
    isoDate: inputDate,
  }
})
