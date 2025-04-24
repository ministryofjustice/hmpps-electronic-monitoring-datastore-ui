import DateValidator from './dateValidator'
import strings from '../../constants/strings'

describe('DateValidator', () => {
  describe('validateDate for a range of valid dates', () => {
    const validDates = [
      ['24', '09', '2023'],
      ['01', '01', '1965'],
      ['31', '12', '1999'],
      ['29', '2', '2020'],
      ['15', '6', '1985'],
      ['', '', ''],
    ]

    validDates.forEach(([day, month, year]) => {
      it(`returns true for valid date ${day}/${month}/${year}`, () => {
        const response = DateValidator.dob.parse({
          day,
          month,
          year,
        })
        expect(response.isValid).toBe(true)
      })
    })
  })

  describe('validateDate for invalid dates with specific error messages', () => {
    const tests = [
      {
        date: ['32', '10', '2024'],
        error: strings.errors.unrealDate,
        description: 'Invalid day',
      },
      { date: ['1', '13', '1965'], error: strings.errors.unrealDate, description: 'Invalid month' },
      {
        date: ['01', '7', '1000'],
        error: `${strings.errors.dateBelowLimit}1st January 1900`,
        description: 'Year out of range',
      },
      { date: ['q', 'q', 'q'], error: strings.errors.unrealDate, description: 'Non-numeric input' },
      { date: ['1', '', ''], error: strings.errors.missingMonth, description: 'Missing month and year' },
      {
        date: ['', '1', '1990'],
        error: strings.errors.missingDay,
        description: 'Missing day',
      },
      {
        date: ['5', '5', ''],
        error: strings.errors.missingYear,
        description: 'Missing year',
      },
      {
        date: ['q', '', ''],
        error: strings.errors.unrealDate,
        description: 'Non-numeric day and missing month and year',
      },
    ]

    tests.forEach(({ date: [day, month, year], error, description }) => {
      it(`returns false and appropriate error message for ${description}: ${day}/${month}/${year}`, () => {
        const response = DateValidator.dob.parse({
          day,
          month,
          year,
        })
        expect(response.isValid).toBe(false)
        expect(response.error).toBeDefined()
        expect(response.error?.error).toBe(error)
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
        const response = DateValidator.dob.parse({
          day,
          month,
          year,
        })
        expect(response.isValid).toBeTruthy()
      })
    })
  })
})
