import { AlcoholMonitoringDatastoreClient } from '../../data'
import AlcoholMonitoringOrderDetailsService from './orderDetailsService'

import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'

jest.mock('../../data')

describe('Alcohol Monitoring order details service', () => {
  let alcoholMonitoringDatastoreClient: AlcoholMonitoringDatastoreClient
  let alcoholMonitoringOrderDetailsService: AlcoholMonitoringOrderDetailsService

  beforeEach(() => {
    alcoholMonitoringDatastoreClient = {
      getOrderDetails: jest.fn(),
      listOrderDetailsByQueryExecutionId: jest.fn(),
    } as unknown as jest.Mocked<AlcoholMonitoringDatastoreClient>
    alcoholMonitoringOrderDetailsService = new AlcoholMonitoringOrderDetailsService(alcoholMonitoringDatastoreClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getOrderDetails', () => {
    const legacySubjectId = '123'

    it('should fetch order summary', async () => {
      const expectedResult = {
        legacySubjectId: '123',
        firstName: '',
        lastName: '',
        alias: '',
        dateOfBirth: '',
        sex: '',
        specialInstructions: '',
        phoneNumber: '',
        address1: '',
        address2: '',
        address3: '',
        postcode: '',
        orderStartDate: '',
        orderEndDate: '',
        enforceableCondition: '',
        orderType: '',
        orderTypeDescription: '',
        orderEndOutcome: '',
        responsibleOrganisationPhoneNumber: '',
        responsibleOrganisationEmail: '',
        tagAtSource: '',
      } as AlcoholMonitoringOrderDetails

      alcoholMonitoringDatastoreClient.getOrderDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await alcoholMonitoringOrderDetailsService.getOrderDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch empty order summary', async () => {
      const expectedResult = {
        legacySubjectId: '123',
        firstName: '',
        lastName: '',
        alias: '',
        dateOfBirth: '',
        sex: '',
        specialInstructions: '',
        phoneNumber: '',
        address1: '',
        address2: '',
        address3: '',
        postcode: '',
        orderStartDate: '',
        orderEndDate: '',
        enforceableCondition: '',
        orderType: '',
        orderTypeDescription: '',
        orderEndOutcome: '',
        responsibleOrganisationPhoneNumber: '',
        responsibleOrganisationEmail: '',
        tagAtSource: '',
      } as AlcoholMonitoringOrderDetails

      alcoholMonitoringDatastoreClient.getOrderDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await alcoholMonitoringOrderDetailsService.getOrderDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      alcoholMonitoringDatastoreClient.getOrderDetails = jest.fn().mockRejectedValue(new Error('Unauthorized'))

      await expect(
        alcoholMonitoringOrderDetailsService.getOrderDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      alcoholMonitoringDatastoreClient.getOrderDetails = jest.fn().mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        alcoholMonitoringOrderDetailsService.getOrderDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })

  describe('getSearchResults', () => {
    it('submits a request containing a query execution ID and returns search results', async () => {
      alcoholMonitoringDatastoreClient.listOrderDetailsByQueryExecutionId = jest.fn().mockResolvedValue([])

      const result = await alcoholMonitoringOrderDetailsService.getSearchResults({
        userToken: 'test-system-token',
        queryExecutionId: 'query_execution_001',
      })

      expect(result).toEqual([])
    })

    it('should propagate an error if there is an authorization error', async () => {
      alcoholMonitoringDatastoreClient.listOrderDetailsByQueryExecutionId = jest
        .fn()
        .mockRejectedValue(new Error('Unauthorized'))

      await expect(
        alcoholMonitoringOrderDetailsService.getSearchResults({
          userToken: 'test-system-token',
          queryExecutionId: 'query_execution_001',
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      alcoholMonitoringDatastoreClient.listOrderDetailsByQueryExecutionId = jest
        .fn()
        .mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        alcoholMonitoringOrderDetailsService.getSearchResults({
          userToken: 'test-system-token',
          queryExecutionId: 'query_execution_001',
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })
})
