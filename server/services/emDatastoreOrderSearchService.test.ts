import { IntegrityDatastoreClient } from '../data'
import EmDatastoreOrderSearchService from './emDatastoreOrderSearchService'
import { OrderSearchCriteria } from '../data/models/orderSearchCriteria'

jest.mock('../data')

describe('Datastore Search Service', () => {
  let integrityDatastoreClient: IntegrityDatastoreClient
  let emDatastoreOrderSearchService: EmDatastoreOrderSearchService

  beforeEach(() => {
    integrityDatastoreClient = {
      runSearchQuery: jest.fn(),
    } as unknown as jest.Mocked<IntegrityDatastoreClient>
    emDatastoreOrderSearchService = new EmDatastoreOrderSearchService(integrityDatastoreClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('submitSearchQuery', () => {
    it('submits a search query and returns an order execution ID for an integrity search', async () => {
      integrityDatastoreClient.runSearchQuery = jest.fn().mockResolvedValue({ queryExecutionId: 'search_query_001' })

      const result = await emDatastoreOrderSearchService.submitSearchQuery(
        'integrity',
        {
          legacySubjectId: '',
          firstName: 'John',
          lastName: 'Doe',
          alias: 'JD',
          dobDay: '10',
          dobMonth: '02',
          dobYear: '2021',
        } as OrderSearchCriteria,
        'token',
      )

      expect(result).toEqual({ queryExecutionId: 'search_query_001' })
    })

    it('submits a search query and returns an order execution ID for an alcohol monitoring search', async () => {
      integrityDatastoreClient.runSearchQuery = jest.fn().mockResolvedValue({ queryExecutionId: 'search_query_010' })

      const result = await emDatastoreOrderSearchService.submitSearchQuery(
        'alcohol-monitoring',
        {
          legacySubjectId: '',
          firstName: 'John',
          lastName: 'Doe',
          alias: 'JD',
          dobDay: '10',
          dobMonth: '02',
          dobYear: '2021',
        } as OrderSearchCriteria,
        'token',
      )

      expect(result).toEqual({ queryExecutionId: 'search_query_010' })
    })

    it('should propagate an error if there is an authorization error', async () => {
      integrityDatastoreClient.runSearchQuery = jest.fn().mockRejectedValue(new Error('Unauthorized'))

      await expect(
        emDatastoreOrderSearchService.submitSearchQuery(
          'integrity',
          {
            legacySubjectId: '',
            firstName: 'John',
            lastName: 'Doe',
            alias: 'JD',
            dobDay: '10',
            dobMonth: '02',
            dobYear: '2021',
          } as OrderSearchCriteria,
          'token',
        ),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      integrityDatastoreClient.runSearchQuery = jest.fn().mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        emDatastoreOrderSearchService.submitSearchQuery(
          'alcohol-monitoring',
          {
            legacySubjectId: '',
            firstName: '',
            lastName: '',
            alias: '',
            dobDay: '',
            dobMonth: '',
            dobYear: '',
          } as OrderSearchCriteria,
          'token',
        ),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })
})
