import { OrderSearchCriteria } from '../../models/requests/OrderSearchRequest'

describe('OrderSearchCriteria', () => {
  describe('safeParse', () => {
    it('returns a validation error when the form is empty', async () => {
      const invalidInput = {
        searchType: 'integrity',
      }

      const result = OrderSearchCriteria.safeParse(invalidInput)

      expect(result.error).toBeDefined()
      expect(result.error!.issues).toEqual([
        expect.objectContaining({
          path: [],
          message: 'You must enter a value into at least one search field',
        }),
      ])
    })

    it('returns a validation error when the form is blank', async () => {
      const invalidInput = {
        searchType: 'integrity',
        legacySubjectId: '',
        firstName: '',
        lastName: '',
        alias: '',
        'dob-day': '',
        'dob-month': '',
        'dob-year': '',
      }

      const result = OrderSearchCriteria.safeParse(invalidInput)

      expect(result.error).toBeDefined()
      expect(result.error!.issues).toEqual([
        expect.objectContaining({
          path: [],
          message: 'You must enter a value into at least one search field',
        }),
      ])
    })

    it('returns a validation error when searchType is not recognised', async () => {
      const invalidInput = {
        searchType: 'bob',
        legacySubjectId: '',
        firstName: 'John',
        lastName: '',
        alias: '',
        'dob-day': '10',
        'dob-month': '02',
        'dob-year': '2021',
      }

      const result = OrderSearchCriteria.safeParse(invalidInput)

      expect(result.error).toBeDefined()
      expect(result.error!.issues).toEqual([
        expect.objectContaining({
          path: ['searchType'],
          message: 'Invalid option: expected one of "integrity"|"alcohol-monitoring"',
        }),
      ])
    })

    it('returns a validation error when firstName is invalid', async () => {
      const invalidInput = {
        searchType: 'integrity',
        legacySubjectId: '',
        firstName: 'John123',
        lastName: '',
        alias: '',
        'dob-day': '10',
        'dob-month': '02',
        'dob-year': '2021',
      }

      const result = OrderSearchCriteria.safeParse(invalidInput)

      expect(result.error).toBeDefined()
      expect(result.error!.issues).toEqual([
        expect.objectContaining({
          path: ['firstName'],
          message: 'First name must contain letters only',
        }),
      ])
    })

    it('returns a validation error when dob is invalid', async () => {
      const invalidInput = {
        searchType: 'alcohol-monitoring',
        legacySubjectId: '',
        firstName: 'John',
        lastName: '',
        alias: '',
        'dob-day': '32',
        'dob-month': '13',
        'dob-year': '2021',
      }

      const result = OrderSearchCriteria.safeParse(invalidInput)

      expect(result.error).toBeDefined()
      expect(result.error!.issues).toEqual([
        expect.objectContaining({
          path: ['dob'],
          message: 'Please enter a real date. For example, 24 10 2020',
        }),
      ])
    })

    it('returns multiple errors when multiple fields are invalid', async () => {
      const invalidInput = {
        searchType: 'integrity',
        legacySubjectId: '',
        firstName: 'John123',
        lastName: '',
        alias: '',
        'dob-day': 'q',
        'dob-month': '13',
        'dob-year': '2021',
      }

      const result = OrderSearchCriteria.safeParse(invalidInput)

      expect(result.error).toBeDefined()
      expect(result.error!.issues).toEqual([
        expect.objectContaining({
          path: ['firstName'],
          message: 'First name must contain letters only',
        }),
        expect.objectContaining({
          path: ['dob-day'],
          message: 'Please enter a real date. For example, 24 10 2020',
        }),
      ])
    })

    it('returns no errors when form data is valid', async () => {
      const validInput = {
        searchType: 'integrity',
        legacySubjectId: '',
        firstName: 'John',
        lastName: '',
        alias: '',
        'dob-day': '10',
        'dob-month': '02',
        'dob-year': '2021',
      }

      const result = OrderSearchCriteria.safeParse(validInput)

      expect(result.error).not.toBeDefined()
      expect(result.success).toEqual(true)
    })
  })
})
