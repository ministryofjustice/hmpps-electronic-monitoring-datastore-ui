import nock from 'nock'
import AlcoholMonitoringVisitDetailsService from './visitDetailsService'

import { AlcoholMonitoringVisitDetails } from '../../models/alcoholMonitoring/visitDetails'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'

describe('Alcohol Monitoring Equipment Details Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let alcoholMonitoringVisitDetailsService: AlcoholMonitoringVisitDetailsService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    alcoholMonitoringVisitDetailsService = new AlcoholMonitoringVisitDetailsService(emDatastoreApiClient)
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

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({ legacySubjectId })

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

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({ legacySubjectId })

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

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details', async () => {
      const expectedResult = [] as AlcoholMonitoringVisitDetails[]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`).reply(401)

      await expect(
        alcoholMonitoringVisitDetailsService.getVisitDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of visit details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient
        .get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`)
        .replyWithError('Fake unexpected server error')

      await expect(
        alcoholMonitoringVisitDetailsService.getVisitDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of visit details: Fake unexpected server error'))
    })
  })
})
