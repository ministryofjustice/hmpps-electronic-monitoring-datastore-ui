import { DateValidator, MIN_YEAR, LAST_HISTORICAL_DATE } from './dateValidator'
import strings from '../../constants/strings'

describe('DateValidator', () => {
  describe('validateDate for a range of valid dates', () => {
    const validDates = [
      ['24', '09', '2023'],
      ['01', '01', '1965'],
      ['31', '12', '1999'],
      ['29', '2', '2020'],
      ['15', '6', '1985'],
    ]

    validDates.forEach(([day, month, year]) => {
      it(`returns true for valid date ${day}/${month}/${year}`, () => {
        const response = DateValidator.validateDate(day, month, year, 'dateField')
        expect(response.result).toBeTruthy()
      })
    })
  })

  describe('validateDate for invalid dates with specific error messages', () => {
    const tests = [
      { date: ['32', '10', '2024'], message: strings.errors.incorrectDateFormat, description: 'Invalid day' },
      { date: ['1', '13', '1965'], message: strings.errors.incorrectDateFormat, description: 'Invalid month' },
      { date: ['01', '7', '1000'], message: strings.errors.incorrectDateFormat, description: 'Year out of range' },
      { date: ['q', 'q', 'q'], message: strings.errors.incorrectDateFormat, description: 'Non-numeric input' },
      { date: ['1', '', ''], message: strings.errors.incompleteDate, description: 'Missing month and year' },
      {
        date: ['q', '', ''],
        message: strings.errors.incompleteDate,
        description: 'Non-numeric day and missing month and year',
      },
    ]

    tests.forEach(({ date: [day, month, year], message, description }) => {
      it(`returns false and appropriate error message for ${description}: ${day}/${month}/${year}`, () => {
        const response = DateValidator.validateDate(day, month, year, 'dateField')
        expect(response.result).toBeFalsy()
        expect(response.error).toBeDefined()
        expect(response.error?.message).toBe(message)
      })
    })
  })
  describe('validateDate for valid edge cases', () => {
    const validDates = [
      ['31', '12', '2022'], // Valid end-of-year date
      ['1', '1', '1900'], // Valid start of the allowable year range
      ['29', '2', '2020'], // Valid leap year date
    ]

    validDates.forEach(([day, month, year]) => {
      it(`returns true for valid date ${day}/${month}/${year}`, () => {
        const response = DateValidator.validateDate(day, month, year, 'dateField')
        expect(response.result).toBeTruthy()
      })
    })
  })
})
