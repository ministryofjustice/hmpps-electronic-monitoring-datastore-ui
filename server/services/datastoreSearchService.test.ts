import { ZodError } from 'zod'
import DatastoreSearchService from './datastoreSearchService'
import orders from '../data/mockData/orders'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

import { Order } from '../interfaces/order'
import { DateValidator } from '../utils/validators/dateValidator'
import Validator from '../utils/validators/formFieldValidator'
import { SearchFormInput } from '../types/SearchFormInput'
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
    it('returns validation errors when firstName is invalid', async () => {
      jest.spyOn(DateValidator, 'validateDate').mockReturnValue({ result: true })

      jest.spyOn(Validator.firstName, 'safeParse').mockImplementation(() => {
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

      expect(Validator.firstName.safeParse).toHaveBeenCalledWith('John123')
      expect(result).toEqual([
        {
          field: 'firstName',
          error: 'First name must contain letters only',
        },
      ])
    })

    it('returns validation errors when dob is invalid', async () => {
      jest.spyOn(DateValidator, 'validateDate').mockReturnValue({
        result: false,
        error: {
          field: 'dob',
          error:
            'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2020.',
        },
      })

      jest.spyOn(Validator.firstName, 'safeParse').mockImplementation(() => {
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

      jest.spyOn(Validator.firstName, 'safeParse').mockImplementation(() => {
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
      expect(Validator.firstName.safeParse).toHaveBeenCalledWith('John123')
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
      jest.spyOn(Validator.firstName, 'safeParse').mockImplementation(() => {
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
      expect(Validator.firstName.safeParse).toHaveBeenCalledWith('John')
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
