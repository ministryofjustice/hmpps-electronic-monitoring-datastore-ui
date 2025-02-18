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
  const queryExecutionId = 'query-execution-id'
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
          field: 'emptyForm',
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

      expect(NameValidator.firstName.safeParse).toHaveBeenCalledWith('John')
      expect(DateValidator.validateDate).toHaveBeenCalledWith('10', '02', '2021', 'dob')
      expect(result).toEqual([])
    })
  })

  describe('submitSearchQuery', () => {
    it('submits a search query and returns an order execution ID', async () => {
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

      jest.spyOn(datastoreClient, 'submitSearchQuery').mockResolvedValue(queryExecutionId)

      const result = await datastoreSearchService.submitSearchQuery(validInput)

      expect(datastoreClient.submitSearchQuery).toHaveBeenCalledWith(validInput)
      expect(result).toEqual(queryExecutionId)
    })

    it('handles errors from the datastore client', async () => {
      jest.spyOn(datastoreClient, 'submitSearchQuery').mockImplementationOnce(() => {
        throw getSanitisedError(new Error('Client error'))
      })

      const input = {
        token: 'mockToken',
        data: {},
      }

      expect(datastoreSearchService.submitSearchQuery(input)).rejects.toThrow('Error submitting search query')
    })
  })

  describe('getSearchResults', () => {
    it('submits a request containing a query execution ID and returns search results', async () => {
      jest.spyOn(datastoreClient, 'getSearchResults').mockResolvedValue(orders)

      const request = {
        token,
        queryExecutionId,
      }

      const result = await datastoreSearchService.getSearchResults(request)

      expect(datastoreClient.getSearchResults).toHaveBeenCalledWith(request)
      expect(result).toEqual(orders)
    })

    it('handles errors from the datastore client', async () => {
      jest.spyOn(datastoreClient, 'getSearchResults').mockImplementationOnce(() => {
        throw getSanitisedError(new Error('Client error'))
      })

      const request = {
        token,
        queryExecutionId: '',
      }

      expect(datastoreSearchService.getSearchResults(request)).rejects.toThrow('Error retrieving search results')
    })
  })
})
