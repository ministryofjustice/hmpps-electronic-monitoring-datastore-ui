import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import IntegrityServiceDetailsService from './serviceDetailsService'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config from '../../config'
import { IntegrityServiceDetails } from '../../data/models/integrityServiceDetails'

describe('Integrity Service Details Service', () => {
  let exampleEmDatastoreApiClient: EmDatastoreApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  let integrityServiceDetailsService: IntegrityServiceDetailsService

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('unused-test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    exampleEmDatastoreApiClient = new EmDatastoreApiClient(mockAuthenticationClient)
    integrityServiceDetailsService = new IntegrityServiceDetailsService(exampleEmDatastoreApiClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getServiceDetails', () => {
    const legacySubjectId = '123'

    it('should fetch a list of one service detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceId: 321,
          serviceAddress1: 'address line 1',
          serviceAddress2: 'address line 2',
          serviceAddress3: 'address line 3',
          serviceAddressPostCode: 'postCode',
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

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/service-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integrityServiceDetailsService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of one service detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceId: 0,
          serviceAddress1: null,
          serviceAddress2: null,
          serviceAddress3: null,
          serviceAddressPostCode: null,
          serviceStartDate: null,
          serviceEndDate: null,
          curfewStartDate: null,
          curfewEndDate: null,
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
        } as IntegrityServiceDetails,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/service-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integrityServiceDetailsService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple service detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceId: 1,
          serviceAddress1: null,
          serviceAddress2: null,
          serviceAddress3: null,
          serviceAddressPostCode: null,
          serviceStartDate: null,
          serviceEndDate: null,
          curfewStartDate: null,
          curfewEndDate: null,
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
        } as IntegrityServiceDetails,
        {
          legacySubjectId: '456',
          serviceId: 2,
          serviceAddress1: null,
          serviceAddress2: null,
          serviceAddress3: null,
          serviceAddressPostCode: null,
          serviceStartDate: null,
          serviceEndDate: null,
          curfewStartDate: null,
          curfewEndDate: null,
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
        } as IntegrityServiceDetails,
        {
          legacySubjectId: '789',
          serviceId: 3,
          serviceAddress1: null,
          serviceAddress2: null,
          serviceAddress3: null,
          serviceAddressPostCode: null,
          serviceStartDate: null,
          serviceEndDate: null,
          curfewStartDate: null,
          curfewEndDate: null,
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
        } as IntegrityServiceDetails,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/service-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integrityServiceDetailsService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of service detail items', async () => {
      const expectedResult = [] as IntegrityServiceDetails[]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/service-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integrityServiceDetailsService.getServiceDetails({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/service-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(401)

      await expect(
        integrityServiceDetailsService.getServiceDetails({
          userToken: 'test-system-token',
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Error retrieving service details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/service-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(500)
        .persist()

      await expect(
        integrityServiceDetailsService.getServiceDetails({
          userToken: 'test-system-token',
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Error retrieving service details: Internal Server Error'))
    })
  })
})
