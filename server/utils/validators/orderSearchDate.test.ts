import { OrderSearchCriteria } from '../../models/requests/SearchOrdersRequest'

describe('OrderSearchCriteria', () => {
  describe('is successful when no date is provided', () => {
    it(`returns true if all date fields are empty`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: '',
        dobMonth: '',
        dobYear: '',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true if all date fields are undefined`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: undefined,
        dobMonth: undefined,
        dobYear: undefined,
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true if all date fields are null`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: null,
        dobMonth: null,
        dobYear: null,
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
        dobDay: '01',
        dobMonth: '01',
        dobYear: '1965',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true for the valid date 31/12/1999`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: '31',
        dobMonth: '12',
        dobYear: '1999',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true for the valid date 29/02/2020`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: '29',
        dobMonth: '02',
        dobYear: '2020',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true for the valid date 15/06/1985`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: '15',
        dobMonth: '06',
        dobYear: '1985',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true for the valid date 24/09/2023`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: '24',
        dobMonth: '09',
        dobYear: '2023',
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })
  })

  describe('Fails invalid dates with specific error messages', () => {
    it(`returns false if invalid day: 32/10/2024`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: 32,
        dobMonth: 13,
        dobYear: 2021,
      })

      expect(result.error).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.error.issues).toHaveLength(1)
    })

    it(`returns false if invalid month: 01/13/1965`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: 1,
        dobMonth: 13,
        dobYear: 1965,
      })

      expect(result.error).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.error.issues).toHaveLength(1)
    })

    it(`returns false if year too early: 01/07/1000`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: 1,
        dobMonth: 7,
        dobYear: 1000,
      })

      expect(result.error).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.error.issues).toHaveLength(1)
    })

    it(`returns false if not numbers: q/q/q`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: 'q',
        dobMonth: 'q',
        dobYear: 'q',
      })

      expect(result.error).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.error.issues).toHaveLength(3)
    })

    it(`returns false if only one part: 1//`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: 1,
        dobMonth: '',
        dobYear: '',
      })

      expect(result.error).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.error.issues).toHaveLength(1)
    })

    it(`returns false if missing the day: /1/1990`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: '',
        dobMonth: 1,
        dobYear: 1990,
      })

      expect(result.error).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.error.issues).toHaveLength(1)
    })

    it(`returns false if missing the year: 5/5/`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: 5,
        dobMonth: 5,
        dobYear: '',
      })

      expect(result.error).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.error.issues).toHaveLength(1)
    })

    it(`returns false if not number and missing parts: q//`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: 'q',
        dobMonth: '',
        dobYear: '',
      })

      expect(result.error).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.error.issues).toHaveLength(1)
    })
  })

  describe('Passes valid edge cases', () => {
    it(`returns true for valid end of year date 31/12/2022`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: 31,
        dobMonth: 12,
        dobYear: 2022,
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true for valid start of the allowable year range 01/01/1900`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: 1,
        dobMonth: 1,
        dobYear: 1900,
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })

    it(`returns true for valid leap year date 29/02/2020`, () => {
      const result = OrderSearchCriteria.safeParse({
        firstName: 'John',
        dobDay: 29,
        dobMonth: 2,
        dobYear: 2020,
      })

      expect(result.error).not.toBeDefined()
      expect(result.success).toBeTruthy()
    })
  })
})
