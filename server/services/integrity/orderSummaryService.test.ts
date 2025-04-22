import nock from 'nock'
import IntegrityOrderSummaryService from './orderSummaryService'

import { IntegrityOrderSummary } from '../../models/integrity/orderSummary'
import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'

describe('Integrity order summary Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let integrityOrderSummaryService: IntegrityOrderSummaryService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    integrityOrderSummaryService = new IntegrityOrderSummaryService(emDatastoreApiClient)
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

  describe('getOrderDetails', () => {
    const legacySubjectId = '123'

    it('should fetch order summary', async () => {
      const expectedResult = {
        keyOrderInformation: {
          specials: 'no',
          legacySubjectId,
          name: 'Testopher Fakesmith',
          alias: 'an old tv show',
          dateOfBirth: '1950-01-01',
          postcode: '7AB 8CD',
          address1: '123 Fourth Street',
          address2: 'Fiveton',
          address3: 'Sixbury',
          orderStartDate: '2010-01-01T00:00:00',
          orderEndDate: '2030-01-01T00:00:00',
        },
        subjectHistoryReport: {
          reportUrl: '',
          name: '',
          createdOn: '',
          time: '',
        },
        documents: {
          pageSize: 1,
          orderDocuments: [],
        },
      } as IntegrityOrderSummary

      fakeClient.get(`/orders/integrity/${legacySubjectId}`).reply(200, expectedResult)

      const result = await integrityOrderSummaryService.getOrderSummary({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch empty order summary', async () => {
      const expectedResult = {
        keyOrderInformation: {
          specials: null,
          legacySubjectId,
          name: null,
          alias: null,
          dateOfBirth: null,
          postcode: null,
          address1: null,
          address2: null,
          address3: null,
          orderStartDate: null,
          orderEndDate: null,
        },
        subjectHistoryReport: {
          reportUrl: null,
          name: null,
          createdOn: null,
          time: null,
        },
        documents: {
          pageSize: 1,
          orderDocuments: [],
        },
      } as IntegrityOrderSummary

      fakeClient.get(`/orders/integrity/${legacySubjectId}`).reply(200, expectedResult)

      const result = await integrityOrderSummaryService.getOrderSummary({ legacySubjectId })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/integrity/${legacySubjectId}`).reply(401)

      await expect(
        integrityOrderSummaryService.getOrderSummary({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order summary: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient.get(`/orders/integrity/${legacySubjectId}`).replyWithError('Fake unexpected server error')

      await expect(
        integrityOrderSummaryService.getOrderSummary({
          legacySubjectId,
        }),
      ).rejects.toEqual(new Error('Error retrieving order summary: Fake unexpected server error'))
    })
  })
})
