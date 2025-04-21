import nock from 'nock'
import AlcoholMonitoringVisitDetailsService from './visitDetailsService'

import { AlcoholMonitoringVisitDetails } from '../../models/alcoholMonitoring/visitDetails'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'

describe('Alcohol Monitoring Visit Details Service', () => {
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
          visitId: '300',
          visitType: 'visit type',
          visitAttempt: 'attempt 1',
          dateVisitRaised: '2001-01-01T00:00:00',
          visitAddress: 'test visit address',
          visitNotes: 'visit notes',
          visitOutcome: 'visit outcome',
          actualWorkStartDateTime: '2002-02-02T02:20:20',
          actualWorkEndDateTime: '2003-03-03T03:30:30',
          visitRejectionReason: 'rejection reason',
          visitRejectionDescription: 'rejection description',
          visitCancelReason: 'cancel reason',
          visitCancelDescription: 'cancel description',
        },
      ]

      fakeClient.get(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await alcoholMonitoringVisitDetailsService.getVisitDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of multiple visit detail items', async () => {
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
