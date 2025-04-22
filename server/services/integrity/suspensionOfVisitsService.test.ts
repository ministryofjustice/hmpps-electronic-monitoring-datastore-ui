import nock from 'nock'
import IntegritySuspensionOfVisitsService from './suspensionOfVisitsService'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'
import { IntegritySuspensionOfVisitsEvent } from '../../models/integrity/suspensionOfVisits'

describe('Integrity Suspension of visits Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let integritySuspensionOfVisitsService: IntegritySuspensionOfVisitsService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    integritySuspensionOfVisitsService = new IntegritySuspensionOfVisitsService(emDatastoreApiClient)
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

  describe('getSuspensionOfVisits', () => {
    const legacySubjectId = 123

    it('should fetch a list of one suspension of visits item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          suspensionOfVisits: 'yes',
          requestedDate: null,
          startDate: null,
          startTime: null,
          endDate: null,
        } as IntegritySuspensionOfVisitsEvent,
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/suspension-of-visits`).reply(200, expectedResult)

      const result = await integritySuspensionOfVisitsService.getSuspensionOfVisits({
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
        } as IntegritySuspensionOfVisitsEvent,
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/suspension-of-visits`).reply(200, expectedResult)

      const result = await integritySuspensionOfVisitsService.getSuspensionOfVisits({
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
        } as IntegritySuspensionOfVisitsEvent,
        {
          legacySubjectId: 456,
          suspensionOfVisits: 'no',
          requestedDate: null,
          startDate: null,
          startTime: null,
          endDate: null,
        } as IntegritySuspensionOfVisitsEvent,
        {
          legacySubjectId: 789,
          suspensionOfVisits: 'yes',
          requestedDate: null,
          startDate: null,
          startTime: null,
          endDate: null,
        } as IntegritySuspensionOfVisitsEvent,
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/suspension-of-visits`).reply(200, expectedResult)

      const result = await integritySuspensionOfVisitsService.getSuspensionOfVisits({
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of equipment detail items', async () => {
      const expectedResult = [] as IntegritySuspensionOfVisitsEvent[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/suspension-of-visits`).reply(200, expectedResult)

      const result = await integritySuspensionOfVisitsService.getSuspensionOfVisits({
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/integrity/${legacySubjectId}/suspension-of-visits`).reply(401)

      await expect(
        integritySuspensionOfVisitsService.getSuspensionOfVisits({
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Error retrieving suspension of visits data: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient
        .get(`/orders/integrity/${legacySubjectId}/suspension-of-visits`)
        .replyWithError('Fake unexpected server error')

      await expect(
        integritySuspensionOfVisitsService.getSuspensionOfVisits({
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Error retrieving suspension of visits data: Fake unexpected server error'))
    })
  })
})
