import OrderSearchCriteriaValidator from './orderSearchCriteriaValidator'

describe('OrderSearchCriteriaValidator', () => {
  describe('validateInput', () => {
    it('returns a validation error when the form is empty', async () => {
      const invalidInput = {
        searchType: '',
        legacySubjectId: '',
        firstName: '',
        lastName: '',
        alias: '',
        dobDay: '',
        dobMonth: '',
        dobYear: '',
      }
      const expectedResult = [
        {
          field: 'emptyForm',
          error: 'You must enter a value into at least one search field',
        },
      ]

      const result = OrderSearchCriteriaValidator.validateInput(invalidInput)
      expect(result).toEqual(expectedResult)
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

      const result = OrderSearchCriteriaValidator.validateInput(invalidInput)
      expect(result).toEqual([
        {
          field: 'firstName',
          error: 'First name must contain letters only',
        },
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

      const result = OrderSearchCriteriaValidator.validateInput(invalidInput)
      expect(result).toEqual([
        {
          field: 'dob',
          error: 'Please enter a real date in the format DD/MM/YYYY. For example, 24/10/2020',
        },
      ])
    })

    it('returns multiple errors when multiple fields are invalid', async () => {
      const invalidInput = {
        searchType: '',
        legacySubjectId: '',
        firstName: 'John123',
        lastName: '',
        alias: '',
        dobDay: '32',
        dobMonth: '13',
        dobYear: '2021',
      }

      const result = OrderSearchCriteriaValidator.validateInput(invalidInput)
      expect(result).toEqual([
        {
          field: 'dob',
          error: 'Please enter a real date in the format DD/MM/YYYY. For example, 24/10/2020',
        },
        {
          field: 'firstName',
          error: 'First name must contain letters only',
        },
      ])
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

      const result = OrderSearchCriteriaValidator.validateInput(validInput)
      expect(result).toEqual([])
    })
  })
})
