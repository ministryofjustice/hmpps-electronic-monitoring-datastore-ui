import DatastoreOrderService from './datastoreOrderService'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreClient')

describe('Datastore Order Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const datastoreClient = createDatastoreClient()

  const datastoreClientFactory = jest.fn()

  let datastoreOrderService: DatastoreOrderService

  beforeEach(() => {
    datastoreClientFactory.mockReturnValue(datastoreClient)
    datastoreOrderService = new DatastoreOrderService(datastoreClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set up and tear down the tests successfully', async () => {
    expect(true).toBe(true)
  })
})
