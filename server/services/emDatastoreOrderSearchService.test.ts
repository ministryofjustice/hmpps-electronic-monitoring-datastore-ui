import EmDatastoreOrderSearchService from './emDatastoreOrderSearchService'
import orders from '../data/mockData/orders'
import { createMockEmDatastoreApiClient } from '../data/testUtils/mocks'
import getSanitisedError from '../sanitisedError'

jest.mock('../data/emDatastoreApiClient')
jest.mock('../utils/validators/dateValidator', () => ({
  dateValidator: { parse: jest.fn() },
}))

describe('Datastore Search Service', () => {
  const userToken = 'fake-user-token'
  const queryExecutionId = 'query-execution-id'
  const queryExecutionResponse = {
    queryExecutionId,
  }
  const emDatastoreApiClient = createMockEmDatastoreApiClient()

  let datastoreSearchService: EmDatastoreOrderSearchService

  beforeEach(() => {
    datastoreSearchService = new EmDatastoreOrderSearchService(emDatastoreApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set up and tear down the tests successfully', async () => {
    expect(true).toBe(true)
  })

  describe('submitSearchQuery', () => {
    it('submits a search query and returns an order execution ID', async () => {
      const validInput = {
        userToken: 'token',
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

      jest.spyOn(emDatastoreApiClient, 'submitSearchQuery').mockResolvedValue(queryExecutionResponse)

      const result = await datastoreSearchService.submitSearchQuery(validInput)

      expect(emDatastoreApiClient.submitSearchQuery).toHaveBeenCalledWith(validInput, 'token')
      expect(result).toEqual(queryExecutionResponse)
    })

    it('handles errors from the datastore client', async () => {
      jest.spyOn(emDatastoreApiClient, 'submitSearchQuery').mockImplementationOnce(() => {
        throw getSanitisedError(new Error('Client error'))
      })

      const input = {
        userToken: 'token',
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
      jest.spyOn(emDatastoreApiClient, 'getSearchResults').mockResolvedValue(orders)

      const request = {
        userToken,
        queryExecutionId,
      }

      const result = await datastoreSearchService.getSearchResults(request)

      expect(emDatastoreApiClient.getSearchResults).toHaveBeenCalledWith(request, userToken)
      expect(result).toEqual(orders)
    })

    describe('error handling', () => {
      it('handles invalid query execution ID errors from the datastore client', async () => {
        const request = {
          userToken,
          queryExecutionId: '',
        }

        const error = {
          data: {
            status: 500,
            userMessage: '',
            developerMessage: 'QueryExecution ABC was not found (Service: Athena, Status Code: 400, Request ID: ABC',
          },
        }

        jest.spyOn(emDatastoreApiClient, 'getSearchResults').mockImplementationOnce(() => {
          throw error
        })

        await expect(datastoreSearchService.getSearchResults(request)).rejects.toThrow(
          'Error retrieving search results: Invalid query execution ID',
        )
      })

      it('handles other errors from the datastore client', async () => {
        jest.spyOn(emDatastoreApiClient, 'getSearchResults').mockImplementationOnce(() => {
          throw new Error()
        })

        const request = {
          userToken,
          queryExecutionId: '',
        }

        await expect(datastoreSearchService.getSearchResults(request)).rejects.toThrow(
          'Error retrieving search results',
        )
      })
    })
  })
})
