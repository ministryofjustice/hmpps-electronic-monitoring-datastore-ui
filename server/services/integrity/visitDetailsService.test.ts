import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import IntegrityVisitDetailsService from './visitDetailsService'

import { IntegrityVisitDetails } from '../../data/models/integrityVisitDetails'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config from '../../config'

describe('Alcohol Monitoring Equipment Details Service', () => {
  let exampleEmDatastoreApiClient: EmDatastoreApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  let integrityVisitDetailsService: IntegrityVisitDetailsService

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('unused-test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    exampleEmDatastoreApiClient = new EmDatastoreApiClient(mockAuthenticationClient)
    integrityVisitDetailsService = new IntegrityVisitDetailsService(exampleEmDatastoreApiClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getVisitDetails', () => {
    const legacySubjectId = '123'

    it('should fetch list of visit details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123',
          address: null,
          actualWorkStartDateTime: '2020-02-02T00:00:00.000Z',
          actualWorkEndDateTime: null,
          visitNotes: null,
          visitType: null,
          visitOutcome: null,
        } as IntegrityVisitDetails,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/visit-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integrityVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details even if not visit details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123',
          address: null,
          actualWorkStartDateTime: '2020-03-03T00:00:00.000Z',
          actualWorkEndDateTime: null,
          visitNotes: null,
          visitType: null,
          visitOutcome: null,
        } as IntegrityVisitDetails,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/visit-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integrityVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of multiple equipment detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          address: null,
          actualWorkStartDateTime: '2020-04-04T00:00:00.000Z',
          actualWorkEndDateTime: null,
          visitNotes: null,
          visitType: null,
          visitOutcome: null,
        } as IntegrityVisitDetails,
        {
          legacySubjectId: '456',
          address: null,
          actualWorkStartDateTime: '2020-05-05T00:00:00.000Z',
          actualWorkEndDateTime: null,
          visitNotes: null,
          visitType: null,
          visitOutcome: null,
        } as IntegrityVisitDetails,
        {
          legacySubjectId: '789',
          address: null,
          actualWorkStartDateTime: '2020-06-06T00:00:00.000Z',
          actualWorkEndDateTime: null,
          visitNotes: null,
          visitType: null,
          visitOutcome: null,
        } as IntegrityVisitDetails,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/visit-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integrityVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details', async () => {
      const expectedResult = [] as IntegrityVisitDetails[]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/visit-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integrityVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/visit-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(401)

      await expect(
        integrityVisitDetailsService.getVisitDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of visit details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/visit-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(500)
        .persist()

      await expect(
        integrityVisitDetailsService.getVisitDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of visit details: Internal Server Error'))
    })
  })
})
