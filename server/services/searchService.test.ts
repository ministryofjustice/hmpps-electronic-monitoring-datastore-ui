import SearchService from './searchService'
import { mockSearchResponse } from '../../integration_tests/mockApis/emApiService'
import orders from '../data/mockData/orders'
import RestClient from '../data/restClient'

jest.mock('../data/restClient')

const mockResponse =  mockSearchResponse()

describe('Search service', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let searchService: SearchService

  beforeEach(() => {
    mockRestClient = new RestClient('datastoreApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    
    searchService = new SearchService(mockRestClient)
  })

  describe('getOrders', () => {
    it('returns true', async () => {
      const expectedData = orders
      const results = await searchService.getOrders()
      expect(results).toBe(expectedData)
    })
  })

  describe('testEndpoint', () => {
    it('should call the rest api', async () => {
      mockRestClient.get.mockResolvedValue(mockResponse)
      
      const result = await searchService.testEndpoint()

      expect(mockRestClient.get).toHaveBeenCalledWith({
        path: '/api/test-endpoint',
        token: '3',
      })
      expect(result).toEqual(true)
    })
  })
})
