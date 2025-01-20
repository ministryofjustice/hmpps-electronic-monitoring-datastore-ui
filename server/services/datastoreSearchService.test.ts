import { ZodError } from 'zod'
import DatastoreSearchService from './datastoreSearchService'
import orders from '../data/mockData/orders'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'
import { DateValidator } from '../utils/validators/dateValidator'
import NameValidator from '../utils/validators/nameValidator'
import { ValidationResult } from '../models/Validation'
import getSanitisedError from '../sanitisedError'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreClient')

describe('Datastore Search Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const datastoreClient = createDatastoreClient()

  const datastoreClientFactory = jest.fn()

  let datastoreSearchService: DatastoreSearchService

  beforeEach(() => {
    datastoreClientFactory.mockReturnValue(datastoreClient)
    datastoreSearchService = new DatastoreSearchService(datastoreClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set up and tear down the tests successfully', async () => {
    expect(true).toBe(true)
  })

  describe('validateInput', () => {
    it('returns a validation error when the form is empty', async () => {
      jest.spyOn(datastoreSearchService, 'isEmptySearch')
      jest.spyOn(datastoreSearchService, 'validateInput')

      const invalidInput = {
        token: 'mockToken',
        data: {
          firstName: '',
          'dob-day': '',
          'dob-month': '',
          'dob-year': '',
        },
      }
      const expectedResult = [
        {
          field: 'form',
          error: 'You must enter a value into at least one search field',
        },
      ]

      const result: ValidationResult = datastoreSearchService.validateInput(invalidInput)

      expect(datastoreSearchService.validateInput).toHaveBeenCalledWith(invalidInput)
      expect(datastoreSearchService.isEmptySearch).toHaveBeenCalledWith(invalidInput.data)
      expect(result).toEqual(expectedResult)
    })

    it('returns a validation error when firstName is invalid', async () => {
      jest.spyOn(DateValidator, 'validateDate').mockReturnValue({ result: true })

      jest.spyOn(NameValidator.firstName, 'safeParse').mockImplementation(() => {
        return {
          success: false,
          error: new ZodError([
            {
              code: 'custom',
              path: ['firstName'],
              message: 'First name must contain letters only',
            },
          ]),
        }
      })

      const invalidInput = {
        token: 'mockToken',
        data: {
          firstName: 'John123',
          'dob-day': '10',
          'dob-month': '02',
          'dob-year': '2021',
        },
      }

      const result: ValidationResult = datastoreSearchService.validateInput(invalidInput)

      expect(NameValidator.firstName.safeParse).toHaveBeenCalledWith('John123')
      expect(result).toEqual([
        {
          field: 'firstName',
          error: 'First name must contain letters only',
        },
      ])
    })

    it('returns a validation error when dob is invalid', async () => {
      jest.spyOn(DateValidator, 'validateDate').mockReturnValue({
        result: false,
        error: {
          field: 'dob',
          error:
            'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2020.',
        },
      })

      jest.spyOn(NameValidator.firstName, 'safeParse').mockImplementation(() => {
        return { success: true, data: '' }
      })

      const invalidInput = {
        token: 'mockToken',
        data: {
          firstName: 'John',
          'dob-day': '32',
          'dob-month': '13',
          'dob-year': '2021',
        },
      }

      const result: ValidationResult = datastoreSearchService.validateInput(invalidInput)

      // Assertions
      expect(DateValidator.validateDate).toHaveBeenCalledWith('32', '13', '2021', 'dob')
      expect(result).toEqual([
        {
          field: 'dob',
          error:
            'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2020.',
        },
      ])
    })

    it('returns multiple errors when multiple fields are invalid', async () => {
      jest.spyOn(DateValidator, 'validateDate').mockReturnValue({
        result: false,
        error: {
          field: 'dob',
          error:
            'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2020.',
        },
      })

      jest.spyOn(NameValidator.firstName, 'safeParse').mockImplementation(() => {
        return {
          success: false,
          error: new ZodError([
            {
              code: 'custom',
              path: ['firstName'],
              message: 'First name must contain letters only',
            },
          ]),
        }
      })

      const invalidInput = {
        token: 'mockToken',
        data: {
          firstName: 'John123',
          'dob-day': '32',
          'dob-month': '13',
          'dob-year': '2021',
        },
      }

      const result: ValidationResult = datastoreSearchService.validateInput(invalidInput)

      // Assertions
      expect(NameValidator.firstName.safeParse).toHaveBeenCalledWith('John123')
      expect(DateValidator.validateDate).toHaveBeenCalledWith('32', '13', '2021', 'dob')
      expect(result).toEqual([
        {
          field: 'dob',
          error:
            'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2020.',
        },
        {
          field: 'firstName',
          error: 'First name must contain letters only',
        },
      ])
    })

    it('returns no errors when form data is valid', async () => {
      jest.spyOn(DateValidator, 'validateDate').mockReturnValue({ result: true })
      jest.spyOn(NameValidator.firstName, 'safeParse').mockImplementation(() => {
        return { success: true, data: '' }
      })

      const validInput = {
        token: 'mockToken',
        data: {
          firstName: 'John',
          'dob-day': '10',
          'dob-month': '02',
          'dob-year': '2021',
        },
      }

      const result: ValidationResult = datastoreSearchService.validateInput(validInput)

      // Assertions
      expect(NameValidator.firstName.safeParse).toHaveBeenCalledWith('John')
      expect(DateValidator.validateDate).toHaveBeenCalledWith('10', '02', '2021', 'dob')
      expect(result).toEqual([])
    })

    // TODO: Additional tests:
    // Generates input error if the input is empty
    it('throws an error when form data contains no values', async () => {
      // const emptyInput = {
      //   token: 'mockToken',
      //   data: {},
      // }
      // const result: ValidationResult = datastoreSearchService.validateInput(emptyInput)
      // expect(result).toEqual([
      //   {
      //     field: 'form',
      //     error: 'Search must contain at least one value',
      //   },
      // ])
    })
  })

  describe('search', () => {
    it('searches for orders & returns the results', async () => {
      const validInput = {
        token: 'mockToken',
        data: {
          firstName: 'John',
          lastName: 'Doe',
          alias: 'JD',
          'dob-day': '10',
          'dob-month': '02',
          'dob-year': '2021',
        },
      }
      jest.spyOn(datastoreClient, 'searchOrders').mockResolvedValue(orders)

      const result = await datastoreSearchService.search(validInput)

      expect(datastoreClient.searchOrders).toHaveBeenCalledWith(validInput)
      expect(result).toEqual(orders)
    })

    it('handles errors from the datastore client', async () => {
      jest.spyOn(datastoreClient, 'searchOrders').mockImplementationOnce(() => {
        throw getSanitisedError(new Error('Client error'))
      })

      const input = {
        token: 'mockToken',
        data: {},
      }

      expect(datastoreSearchService.search(input)).rejects.toThrow('Error retrieving search results')
    })
  })
})
