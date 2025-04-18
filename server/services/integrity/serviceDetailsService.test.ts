import nock from 'nock'
import IntegrityServiceDetailService from './serviceDetailsService'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'

describe('Integrity Service Details Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let integrityServiceDetailService: IntegrityServiceDetailService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    integrityServiceDetailService = new IntegrityServiceDetailService(emDatastoreApiClient)
  })

  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll()
      throw new Error('Not all nock interceptors were used!')
    }
    nock.abortPendingRequests()
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getServiceDetails', () => {
    const legacySubjectId = '123'

    it('should fetch a list of one service detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId: 123,
          serviceId: 321,
          serviceAddress1: 'address line 1',
          serviceAddress2: 'address line 2',
          serviceAddress3: 'address line 3',
          serviceAddressPostcode: 'postcode',
          serviceStartDate: '2002-05-22T01:01:01',
          serviceEndDate: '2002-05-22T01:01:01',
          curfewStartDate: '2002-05-22T01:01:01',
          curfewEndDate: '2002-05-22T01:01:01',
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
          sunday: 7,
        },
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await integrityServiceDetailService.getServiceDetails({
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of one service detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
        },
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await integrityServiceDetailService.getServiceDetails({
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple service detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
        },
        {
          legacySubjectId: '456',
        },
        {
          legacySubjectId: '789',
        },
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await integrityServiceDetailService.getServiceDetails({
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of service detail items', async () => {
      const expectedResult = [] as IntegrityServiceDetailService[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await integrityServiceDetailService.getServiceDetails({
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/integrity/${legacySubjectId}/service-details`).reply(401)

      await expect(
        integrityServiceDetailService.getServiceDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving service details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient
        .get(`/orders/integrity/${legacySubjectId}/service-details`)
        .replyWithError('Fake unexpected server error')

      await expect(
        integrityServiceDetailService.getServiceDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving service details: Fake unexpected server error'))
    })
  })
})
