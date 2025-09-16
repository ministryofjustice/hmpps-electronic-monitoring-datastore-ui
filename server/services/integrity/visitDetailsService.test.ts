import nock from 'nock'
import IntegrityVisitDetailsService from './visitDetailsService'

import { IntegrityVisitDetails } from '../../data/models/integrityVisitDetails'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'

describe('Alcohol Monitoring Equipment Details Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let integrityVisitDetailsService: IntegrityVisitDetailsService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    integrityVisitDetailsService = new IntegrityVisitDetailsService(emDatastoreApiClient)
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
          address: null,
          actualWorkStartDateTime: '2020-02-02T00:00:00.000Z',
          actualWorkEndDateTime: null,
          visitNotes: null,
          visitType: null,
          visitOutcome: null,
        } as IntegrityVisitDetails,
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await integrityVisitDetailsService.getVisitDetails({ legacySubjectId })

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

      fakeClient.get(`/orders/integrity/${legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await integrityVisitDetailsService.getVisitDetails({ legacySubjectId })

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

      fakeClient.get(`/orders/integrity/${legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await integrityVisitDetailsService.getVisitDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details', async () => {
      const expectedResult = [] as IntegrityVisitDetails[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await integrityVisitDetailsService.getVisitDetails({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/integrity/${legacySubjectId}/visit-details`).reply(401)

      await expect(
        integrityVisitDetailsService.getVisitDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of visit details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient
        .get(`/orders/integrity/${legacySubjectId}/visit-details`)
        .replyWithError('Fake unexpected server error')

      await expect(
        integrityVisitDetailsService.getVisitDetails({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of visit details: Fake unexpected server error'))
    })
  })
})
