import { ZodError } from 'zod'
import DatastoreSearchService from './datastoreSearchService'
import orders from '../data/mockData/orders'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'
import { dateValidator } from '../utils/validators/dateValidator'
import NameValidator from '../utils/validators/nameValidator'
import { ValidationResult } from '../models/Validation'
import getSanitisedError from '../sanitisedError'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreClient')
jest.mock('../utils/validators/dateValidator', () => ({
  dateValidator: { parse: jest.fn() },
}))

describe('Datastore Search Service', () => {
  const token = 'fake-token-value'
  const queryExecutionId = 'query-execution-id'
  const queryExecutionResponse = {
    queryExecutionId,
  }
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
        token: 'token',
        data: {
          searchType: '',
          legacySubjectId: '',
          firstName: '',
          lastName: '',
          alias: '',
          dobDay: '',
          dobMonth: '',
          dobYear: '',
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
      dateValidator.parse = jest.fn().mockReturnValue({
        isValid: true,
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
        token: 'token',
        data: {
          searchType: '',
          legacySubjectId: '',
          firstName: 'John123',
          lastName: '',
          alias: '',
          dobDay: '10',
          dobMonth: '02',
          dobYear: '2021',
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
      dateValidator.parse = jest.fn().mockReturnValue({
        isValid: false,
        error: {
          field: 'dob',
          error: 'Date of birth error',
        },
      })

      jest.spyOn(NameValidator.firstName, 'safeParse').mockImplementation(() => {
        return { success: true, data: '' }
      })

      const invalidInput = {
        token: 'token',
        data: {
          searchType: '',
          legacySubjectId: '',
          firstName: 'John',
          lastName: '',
          alias: '',
          dobDay: '32',
          dobMonth: '13',
          dobYear: '2021',
        },
      }

      const result: ValidationResult = datastoreSearchService.validateInput(invalidInput)

      expect(dateValidator.parse).toHaveBeenCalledWith({
        day: '32',
        month: '13',
        year: '2021',
      })
      expect(result).toEqual([
        {
          field: 'dob',
          error: 'Date of birth error',
        },
      ])
    })

    it('returns multiple errors when multiple fields are invalid', async () => {
      dateValidator.parse = jest.fn().mockReturnValue({
        isValid: false,
        error: {
          field: 'dob',
          error: 'Date of birth error',
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
        token: 'token',
        data: {
          searchType: '',
          legacySubjectId: '',
          firstName: 'John123',
          lastName: '',
          alias: '',
          dobDay: '32',
          dobMonth: '13',
          dobYear: '2021',
        },
      }

      const result: ValidationResult = datastoreSearchService.validateInput(invalidInput)

      expect(NameValidator.firstName.safeParse).toHaveBeenCalledWith('John123')
      expect(dateValidator.parse).toHaveBeenCalledWith({
        day: '32',
        month: '13',
        year: '2021',
      })
      expect(result).toEqual([
        {
          field: 'dob',
          error: 'Date of birth error',
        },
        {
          field: 'firstName',
          error: 'First name must contain letters only',
        },
      ])
    })

    it('returns no errors when form data is valid', async () => {
      dateValidator.parse = jest.fn().mockReturnValue({
        isValid: true,
      })
      jest.spyOn(NameValidator.firstName, 'safeParse').mockImplementation(() => {
        return { success: true, data: '' }
      })

      const validInput = {
        token: 'token',
        data: {
          searchType: '',
          legacySubjectId: '',
          firstName: 'John',
          lastName: '',
          alias: '',
          dobDay: '10',
          dobMonth: '02',
          dobYear: '2021',
        },
      }

      const result: ValidationResult = datastoreSearchService.validateInput(validInput)

      expect(NameValidator.firstName.safeParse).toHaveBeenCalledWith('John')
      expect(dateValidator.parse).toHaveBeenCalledWith({
        day: '10',
        month: '02',
        year: '2021',
      })
      expect(result).toEqual([])
    })
  })

  describe('submitSearchQuery', () => {
    it('submits a search query and returns an order execution ID', async () => {
      const validInput = {
        token: 'token',
        data: {
          searchType: '',
          legacySubjectId: '',
          firstName: 'John',
          lastName: 'Doe',
          alias: 'JD',
          dobDay: '10',
          dobMonth: '02',
          dobYear: '2021',
        },
      }

      jest.spyOn(datastoreClient, 'submitSearchQuery').mockResolvedValue(queryExecutionResponse)

      const result = await datastoreSearchService.submitSearchQuery(validInput)

      expect(datastoreClient.submitSearchQuery).toHaveBeenCalledWith(validInput)
      expect(result).toEqual(queryExecutionResponse)
    })

    it('handles errors from the datastore client', async () => {
      jest.spyOn(datastoreClient, 'submitSearchQuery').mockImplementationOnce(() => {
        throw getSanitisedError(new Error('Client error'))
      })

      const input = {
        token: 'token',
        data: {
          searchType: '',
          legacySubjectId: '',
          firstName: '',
          lastName: '',
          alias: '',
          dobDay: '',
          dobMonth: '',
          dobYear: '',
        },
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

    describe('error handling', () => {
      it('handles invalid query execution ID errors from the datastore client', async () => {
        const request = {
          token,
          queryExecutionId: '',
        }

        const error = {
          data: {
            status: 500,
            userMessage: '',
            developerMessage: 'QueryExecution ABC was not found (Service: Athena, Status Code: 400, Request ID: ABC',
          },
        }

        jest.spyOn(datastoreClient, 'getSearchResults').mockImplementationOnce(() => {
          throw error
        })

        await expect(datastoreSearchService.getSearchResults(request)).rejects.toThrow(
          'Error retrieving search results: Invalid query execution ID',
        )
      })

      it('handles other errors from the datastore client', async () => {
        jest.spyOn(datastoreClient, 'getSearchResults').mockImplementationOnce(() => {
          throw new Error()
        })

        const request = {
          token,
          queryExecutionId: '',
        }

        await expect(datastoreSearchService.getSearchResults(request)).rejects.toThrow(
          'Error retrieving search results',
        )
      })
    })
  })
})
