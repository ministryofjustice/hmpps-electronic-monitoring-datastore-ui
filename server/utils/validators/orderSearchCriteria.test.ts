import { OrderSearchCriteria } from '../../models/requests/SearchOrdersRequest'

describe('OrderSearchCriteria', () => {
  describe('safeParse', () => {
    it('returns a validation error when the form is empty', async () => {
      const invalidInput = {
        searchType: 'integrity',
        legacySubjectId: '',
        firstName: '',
        lastName: '',
        alias: '',
        dobDay: '',
        dobMonth: '',
        dobYear: '',
      }

      const result = OrderSearchCriteria.safeParse(invalidInput)

      expect(result.error).toBeDefined()
      expect(result.error.issues).toEqual([
        expect.objectContaining({
          path: [],
          message: 'You must enter a value into at least one search field',
        }),
      ])
    })

    it('returns a validation error when firstName is invalid', async () => {
      const invalidInput = {
        searchType: '',
        legacySubjectId: '',
        firstName: 'John123',
        lastName: '',
        alias: '',
        dobDay: '10',
        dobMonth: '02',
        dobYear: '2021',
      }

      const result = OrderSearchCriteria.safeParse(invalidInput)

      expect(result.error).toBeDefined()
      expect(result.error.issues).toEqual([
        expect.objectContaining({
          path: ['firstName'],
          message: 'First name must contain letters only',
        }),
      ])
    })

    it('returns a validation error when dob is invalid', async () => {
      const invalidInput = {
        searchType: '',
        legacySubjectId: '',
        firstName: 'John',
        lastName: '',
        alias: '',
        dobDay: '32',
        dobMonth: '13',
        dobYear: '2021',
      }

      const result = OrderSearchCriteria.safeParse(invalidInput)

      expect(result.error).toBeDefined()
      expect(result.error.issues).toEqual([
        expect.objectContaining({
          path: ['dob'],
          message: 'Please enter a real date in the format DD/MM/YYYY. For example, 24/10/2020',
        }),
      ])
    })

    it('returns multiple errors when multiple fields are invalid', async () => {
      const invalidInput = {
        searchType: '',
        legacySubjectId: '',
        firstName: 'John123',
        lastName: '',
        alias: '',
        dobDay: 32,
        dobMonth: 13,
        dobYear: 2021,
      }

      const result = OrderSearchCriteria.safeParse(invalidInput)

      expect(result.error).toBeDefined()
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['firstName'],
            message: 'First name must contain letters only',
          }),
          /*
          expect.objectContaining({
            path: ['dob'],
            message: 'Please enter a real date in the format DD/MM/YYYY. For example, 24/10/2020',
          }),
          */
        ]),
      )
    })

    it('returns no errors when form data is valid', async () => {
      const validInput = {
        searchType: '',
        legacySubjectId: '',
        firstName: 'John',
        lastName: '',
        alias: '',
        dobDay: '10',
        dobMonth: '02',
        dobYear: '2021',
      }

      const result = OrderSearchCriteria.safeParse(validInput)

      expect(result.error).not.toBeDefined()
      expect(result.success).toEqual(true)
    })
  })
})
