import DatastoreSearchService from './datastoreSearchService'
import orders from '../data/mockData/orders'
import { HmppsAuthClient } from '../data'
import DatastoreSearchClient from '../data/datastoreSearchClient'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreSearchClient')

describe('Search service', () => {
  
  let datastoreSearchService: DatastoreSearchService
  
  beforeEach(() => {
    let hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
    // let token: 'fake-token-value'
    // hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)

    let datastoreSearchClient: jest.Mocked<DatastoreSearchClient>

    let datastoreSearchClientFactory = jest.fn()
      .mockReturnValue(datastoreSearchClient)
      
    datastoreSearchService = new DatastoreSearchService(datastoreSearchClientFactory, hmppsAuthClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set up and tear down the tests successfully', async () => {
      expect(true).toBe(true)
    })

  // describe('getOrders', () => {
  //   it('should return data from the client', async () => {
  //     const expectedData = orders
  //     const results = await datastoreSearchService.getOrders()
  //     expect(results).toBe(expectedData)
  //   })
  // })
})
