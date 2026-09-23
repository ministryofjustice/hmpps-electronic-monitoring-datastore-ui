import { IntegrityDatastoreClient } from '../../data'
import IntegrityOrderDetailsService from './orderDetailsService'

import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'

jest.mock('../../data')

describe('Integrity order details Service', () => {
  let integrityDatastoreClient: IntegrityDatastoreClient
  let integrityOrderDetailsService: IntegrityOrderDetailsService

  beforeEach(() => {
    integrityDatastoreClient = {
      listOrderDetailsByQueryExecutionId: jest.fn(),
      getOrderDetails: jest.fn(),
    } as unknown as jest.Mocked<IntegrityDatastoreClient>
    integrityOrderDetailsService = new IntegrityOrderDetailsService(integrityDatastoreClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getOrderDetails', () => {
    const legacySubjectId = '123'

    it('should fetch order details', async () => {
      const expectedResult = {
        specials: 'no',
        legacySubjectId,
        firstName: '',
        lastName: '',
        alias: '',
        dateOfBirth: '',
        adultOrChild: '',
        sex: '',
        contact: '',
        primaryAddressLine1: '',
        primaryAddressLine2: '',
        primaryAddressLine3: '',
        primaryAddressPostCode: '',
        phoneOrMobileNumber: '',
        ppo: '',
        mappa: '',
        technicalBail: '',
        manualRisk: '',
        offenceRisk: false,
        postCodeRisk: '',
        falseLimbRisk: '',
        migratedRisk: '',
        rangeRisk: '',
        reportRisk: '',
        orderStartDate: '',
        orderEndDate: '',
        orderType: '',
        orderTypeDescription: '',
        orderTypeDetail: '',
        wearingWristPid: '',
        notifyingOrganisationDetailsName: '',
        responsibleOrganisation: '',
        responsibleOrganisationDetailsRegion: '',
      } as IntegrityOrderDetails

      integrityDatastoreClient.getOrderDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await integrityOrderDetailsService.getOrderDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch empty order details', async () => {
      const expectedResult = {
        specials: 'no',
        legacySubjectId,
        firstName: '',
        lastName: '',
        alias: '',
        dateOfBirth: '',
        adultOrChild: '',
        sex: '',
        contact: '',
        primaryAddressLine1: '',
        primaryAddressLine2: '',
        primaryAddressLine3: '',
        primaryAddressPostCode: '',
        phoneOrMobileNumber: '',
        ppo: '',
        mappa: '',
        technicalBail: '',
        manualRisk: '',
        offenceRisk: false,
        postCodeRisk: '',
        falseLimbRisk: '',
        migratedRisk: '',
        rangeRisk: '',
        reportRisk: '',
        orderStartDate: '',
        orderEndDate: '',
        orderType: '',
        orderTypeDescription: '',
        orderTypeDetail: '',
        wearingWristPid: '',
        notifyingOrganisationDetailsName: '',
        responsibleOrganisation: '',
        responsibleOrganisationDetailsRegion: '',
      } as IntegrityOrderDetails

      integrityDatastoreClient.getOrderDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await integrityOrderDetailsService.getOrderDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      integrityDatastoreClient.getOrderDetails = jest.fn().mockRejectedValue(new Error('Unauthorized'))

      await expect(
        integrityOrderDetailsService.getOrderDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      integrityDatastoreClient.getOrderDetails = jest.fn().mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        integrityOrderDetailsService.getOrderDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })

  describe('getSearchResults', () => {
    it('submits a request containing a query execution ID and returns search results', async () => {
      integrityDatastoreClient.listOrderDetailsByQueryExecutionId = jest.fn().mockResolvedValue([])

      const result = await integrityOrderDetailsService.getSearchResults({
        userToken: 'test-system-token',
        queryExecutionId: 'query_execution_001',
      })

      expect(result).toEqual([])
    })

    describe('error handling', () => {
      it('should propagate an error if there is an authorization error', async () => {
        integrityDatastoreClient.listOrderDetailsByQueryExecutionId = jest
          .fn()
          .mockRejectedValue(new Error('Unauthorized'))

        await expect(
          integrityOrderDetailsService.getSearchResults({
            userToken: 'test-system-token',
            queryExecutionId: 'query_execution_002',
          }),
        ).rejects.toEqual(new Error('Unauthorized'))
      })

      it('handles invalid query execution ID errors from the datastore client', async () => {
        integrityDatastoreClient.listOrderDetailsByQueryExecutionId = jest
          .fn()
          .mockRejectedValue(new Error('Invalid query execution ID'))

        await expect(
          integrityOrderDetailsService.getSearchResults({
            userToken: 'test-system-token',
            queryExecutionId: 'query_execution_003',
          }),
        ).rejects.toThrow('Invalid query execution ID')
      })

      it('handles other errors from the datastore client', async () => {
        integrityDatastoreClient.listOrderDetailsByQueryExecutionId = jest
          .fn()
          .mockRejectedValue(new Error('Internal Server Error'))

        await expect(
          integrityOrderDetailsService.getSearchResults({
            userToken: 'test-system-token',
            queryExecutionId: 'query_execution_004',
          }),
        ).rejects.toThrow('Internal Server Error')
      })
    })
  })
})
