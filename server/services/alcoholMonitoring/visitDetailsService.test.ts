import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import AlcoholMonitoringVisitDetailsService from './visitDetailsService'

import { AlcoholMonitoringVisitDetails } from '../../data/models/alcoholMonitoringVisitDetails'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config from '../../config'

describe('Alcohol Monitoring Equipment Details Service', () => {
  let exampleEmDatastoreApiClient: EmDatastoreApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  let alcoholMonitoringVisitDetailsService: AlcoholMonitoringVisitDetailsService

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('unused-test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    exampleEmDatastoreApiClient = new EmDatastoreApiClient(mockAuthenticationClient)
    alcoholMonitoringVisitDetailsService = new AlcoholMonitoringVisitDetailsService(exampleEmDatastoreApiClient)
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
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details even if not visit details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123',
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of multiple equipment detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
        {
          legacySubjectId: '456',
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
        {
          legacySubjectId: '789',
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
      ]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details', async () => {
      const expectedResult = [] as AlcoholMonitoringVisitDetails[]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({
        userToken: 'test-system-token',
        legacySubjectId,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(401)

      await expect(
        alcoholMonitoringVisitDetailsService.getVisitDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of visit details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(500)
        .persist()

      await expect(
        alcoholMonitoringVisitDetailsService.getVisitDetails({
          userToken: 'test-system-token',
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of visit details: Internal Server Error'))
    })
  })
})
