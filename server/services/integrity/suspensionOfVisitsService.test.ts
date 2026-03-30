import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import IntegritySuspensionOfVisitsService from './suspensionOfVisitsService'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config from '../../config'
import { IntegritySuspensionOfVisits } from '../../data/models/integritySuspensionOfVisits'

describe('Integrity Suspension of visits Service', () => {
  let exampleEmDatastoreApiClient: EmDatastoreApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  let integritySuspensionOfVisitsService: IntegritySuspensionOfVisitsService

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('unused-test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    exampleEmDatastoreApiClient = new EmDatastoreApiClient(mockAuthenticationClient)
    integritySuspensionOfVisitsService = new IntegritySuspensionOfVisitsService(exampleEmDatastoreApiClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getSuspensionOfVisits', () => {
    const legacySubjectId = '123'

    it('should fetch a list of one suspension of visits item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          suspensionOfVisits: 'yes',
          requestedDate: null,
          startDate: null,
          startTime: null,
          endDate: null,
        } as IntegritySuspensionOfVisits,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/suspension-of-visits`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integritySuspensionOfVisitsService.getSuspensionOfVisits({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of one equipment detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          suspensionOfVisits: 'no',
          requestedDate: null,
          startDate: null,
          startTime: null,
          endDate: null,
        } as IntegritySuspensionOfVisits,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/suspension-of-visits`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integritySuspensionOfVisitsService.getSuspensionOfVisits({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple equipment detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          suspensionOfVisits: 'yes',
          requestedDate: null,
          startDate: null,
          startTime: null,
          endDate: null,
        } as IntegritySuspensionOfVisits,
        {
          legacySubjectId: '456',
          suspensionOfVisits: 'no',
          requestedDate: null,
          startDate: null,
          startTime: null,
          endDate: null,
        } as IntegritySuspensionOfVisits,
        {
          legacySubjectId: '789',
          suspensionOfVisits: 'yes',
          requestedDate: null,
          startDate: null,
          startTime: null,
          endDate: null,
        } as IntegritySuspensionOfVisits,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/suspension-of-visits`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integritySuspensionOfVisitsService.getSuspensionOfVisits({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of equipment detail items', async () => {
      const expectedResult = [] as IntegritySuspensionOfVisits[]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/suspension-of-visits`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integritySuspensionOfVisitsService.getSuspensionOfVisits({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/suspension-of-visits`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(401)

      await expect(
        integritySuspensionOfVisitsService.getSuspensionOfVisits({
          userToken: 'test-system-token',
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Error retrieving suspension of visits data: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/suspension-of-visits`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(500)
        .persist()

      await expect(
        integritySuspensionOfVisitsService.getSuspensionOfVisits({
          userToken: 'test-system-token',
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Error retrieving suspension of visits data: Internal Server Error'))
    })
  })
})
