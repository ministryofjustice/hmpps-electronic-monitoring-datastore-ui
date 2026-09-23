import { OrderSearchCriteria } from '../../models/requests/OrderSearchRequest'

describe('OrderSearchCriteria', () => {
  describe('is successful when no date is provided', () => {
    it(`returns true if all date fields are empty`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '',
        'dob-month': '',
        'dob-year': '',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true if all date fields are undefined`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': undefined,
        'dob-month': undefined,
        'dob-year': undefined,
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true if all date fields are not present`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })
  })

  describe('is successful for a range of valid dates', () => {
    it(`returns true for the valid date 01/01/1965`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '01',
        'dob-month': '01',
        'dob-year': '1965',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true for the valid date 31/12/1999`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '31',
        'dob-month': '12',
        'dob-year': '1999',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true for the valid date 29/02/2020`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '29',
        'dob-month': '02',
        'dob-year': '2020',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true for the valid date 15/06/1985`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '15',
        'dob-month': '06',
        'dob-year': '1985',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true for the valid date 24/09/2023`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '24',
        'dob-month': '09',
        'dob-year': '2023',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })
  })

  describe('Fails invalid dates with specific error messages', () => {
    it(`returns false if invalid day: 32/10/2024`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '32',
        'dob-month': '13',
        'dob-year': '2021',
      })

      expect(result.error).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.error!.issues).toHaveLength(1)
    })

    it(`returns false if invalid month: 01/13/1965`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '1',
        'dob-month': '13',
        'dob-year': '1965',
      })

      expect(result.error).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.error!.issues).toHaveLength(1)
    })

    it(`returns false if year too early: 01/07/1000`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '1',
        'dob-month': '7',
        'dob-year': '1000',
      })

      expect(result.error).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.error!.issues).toHaveLength(1)
    })

    it(`returns false if nulls`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': null,
        'dob-month': null,
        'dob-year': null,
      })

      expect(result.error).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.error!.issues).toHaveLength(3)
    })

    it(`returns false if not numbers: q/q/q`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': 'q',
        'dob-month': 'q',
        'dob-year': 'q',
      })

      expect(result.success).toBeFalsy()
      expect(result.error!.issues).toEqual([
        expect.objectContaining({
          path: ['dob-day'],
          message: 'Please enter a real date. For example, 24 10 2020',
        }),
        expect.objectContaining({
          path: ['dob-month'],
          message: 'Please enter a real date. For example, 24 10 2020',
        }),
        expect.objectContaining({
          path: ['dob-year'],
          message: 'Please enter a real date. For example, 24 10 2020',
        }),
      ])
    })

    it(`returns false if only one part: 1//`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '1',
        'dob-month': '',
        'dob-year': '',
      })

      expect(result.success).toBeFalsy()
      expect(result.error!.issues).toEqual([
        expect.objectContaining({
          path: ['dob'],
          message: 'Please enter a real date. For example, 24 10 2020',
        }),
      ])
    })

    it(`returns false if missing the day: /1/1990`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '',
        'dob-month': '1',
        'dob-year': '1990',
      })

      expect(result.success).toBeFalsy()
      expect(result.error!.issues).toEqual([
        expect.objectContaining({
          path: ['dob'],
          message: 'Please enter a real date. For example, 24 10 2020',
        }),
      ])
    })

    it(`returns false if missing the year: 5/5/`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '5',
        'dob-month': '5',
        'dob-year': '',
      })

      expect(result.success).toBeFalsy()
      expect(result.error!.issues).toEqual([
        expect.objectContaining({
          path: ['dob'],
          message: 'Please enter a real date. For example, 24 10 2020',
        }),
      ])
    })

    it(`returns false if not number and missing parts: q//`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': 'q',
        'dob-month': '',
        'dob-year': '',
      })

      expect(result.success).toBeFalsy()
      expect(result.error!.issues).toEqual([
        expect.objectContaining({
          path: ['dob-day'],
          message: 'Please enter a real date. For example, 24 10 2020',
        }),
      ])
    })
  })

  describe('Passes valid edge cases', () => {
    it(`returns true for valid end of year date 31/12/2022`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '31',
        'dob-month': '12',
        'dob-year': '2022',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true for valid start of the allowable year range 01/01/1900`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '1',
        'dob-month': '1',
        'dob-year': '1900',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true for valid leap year date 29/02/2020`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        'dob-day': '29',
        'dob-month': '2',
        'dob-year': '2020',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })
  })
})
