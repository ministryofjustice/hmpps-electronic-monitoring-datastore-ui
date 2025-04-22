import nock from 'nock'
import IntegrityServiceDetailsService from './serviceDetailsService'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'
import { IntegrityServiceDetails } from '../../models/integrity/serviceDetails'

describe('Integrity Service Details Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let integrityServiceDetailsService: IntegrityServiceDetailsService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    integrityServiceDetailsService = new IntegrityServiceDetailsService(emDatastoreApiClient)
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
    const legacySubjectId = 123

    it('should fetch a list of one service detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
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
          tuesday: 1,
          wednesday: 1,
          thursday: 1,
          friday: 1,
          saturday: 1,
          sunday: 1,
        } as IntegrityServiceDetails,
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await integrityServiceDetailsService.getServiceDetails({
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of one service detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceId: null,
          serviceAddress1: null,
          serviceAddress2: null,
          serviceAddress3: null,
          serviceAddressPostcode: null,
          serviceStartDate: null,
          serviceEndDate: null,
          curfewStartDate: null,
          curfewEndDate: null,
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null,
        } as IntegrityServiceDetails,
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await integrityServiceDetailsService.getServiceDetails({
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple service detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceId: null,
          serviceAddress1: null,
          serviceAddress2: null,
          serviceAddress3: null,
          serviceAddressPostcode: null,
          serviceStartDate: null,
          serviceEndDate: null,
          curfewStartDate: null,
          curfewEndDate: null,
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null,
        } as IntegrityServiceDetails,
        {
          legacySubjectId: 456,
          serviceId: null,
          serviceAddress1: null,
          serviceAddress2: null,
          serviceAddress3: null,
          serviceAddressPostcode: null,
          serviceStartDate: null,
          serviceEndDate: null,
          curfewStartDate: null,
          curfewEndDate: null,
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null,
        } as IntegrityServiceDetails,
        {
          legacySubjectId: 789,
          serviceId: null,
          serviceAddress1: null,
          serviceAddress2: null,
          serviceAddress3: null,
          serviceAddressPostcode: null,
          serviceStartDate: null,
          serviceEndDate: null,
          curfewStartDate: null,
          curfewEndDate: null,
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null,
        } as IntegrityServiceDetails,
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await integrityServiceDetailsService.getServiceDetails({
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of service detail items', async () => {
      const expectedResult = [] as IntegrityServiceDetails[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await integrityServiceDetailsService.getServiceDetails({
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/integrity/${legacySubjectId}/service-details`).reply(401)

      await expect(
        integrityServiceDetailsService.getServiceDetails({
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Error retrieving service details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient
        .get(`/orders/integrity/${legacySubjectId}/service-details`)
        .replyWithError('Fake unexpected server error')

      await expect(
        integrityServiceDetailsService.getServiceDetails({
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Error retrieving service details: Fake unexpected server error'))
    })
  })
})
