import nock from 'nock'
import IntegrityEquipmentDetailsService from './equipmentDetailsService'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config, { ApiConfig } from '../../config'
import { IntegrityEquipmentDetails } from '../../models/integrity/equipmentDetails'

describe('Integrity Equipment Details Service', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  let integrityEquipmentDetailsService: IntegrityEquipmentDetailsService

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(config.apis.emDatastoreApi as ApiConfig)
    integrityEquipmentDetailsService = new IntegrityEquipmentDetailsService(emDatastoreApiClient)
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

  describe('getEquipmentDetails', () => {
    const legacySubjectId = '123'

    it('should fetch a list of one equipment detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
        } as IntegrityEquipmentDetails,
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/equipment-details`).reply(200, expectedResult)

      const result = await integrityEquipmentDetailsService.getEquipmentDetails({
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of one equipment detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
        } as IntegrityEquipmentDetails,
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/equipment-details`).reply(200, expectedResult)

      const result = await integrityEquipmentDetailsService.getEquipmentDetails({
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple equipment detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
        } as IntegrityEquipmentDetails,
        {
          legacySubjectId: '456',
        } as IntegrityEquipmentDetails,
        {
          legacySubjectId: '789',
        } as IntegrityEquipmentDetails,
      ]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/equipment-details`).reply(200, expectedResult)

      const result = await integrityEquipmentDetailsService.getEquipmentDetails({
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of equipment detail items', async () => {
      const expectedResult = [] as IntegrityEquipmentDetails[]

      fakeClient.get(`/orders/integrity/${legacySubjectId}/equipment-details`).reply(200, expectedResult)

      const result = await integrityEquipmentDetailsService.getEquipmentDetails({
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      fakeClient.get(`/orders/integrity/${legacySubjectId}/equipment-details`).reply(401)

      await expect(
        integrityEquipmentDetailsService.getEquipmentDetails({
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of equipment details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      fakeClient
        .get(`/orders/integrity/${legacySubjectId}/equipment-details`)
        .replyWithError('Fake unexpected server error')

      await expect(
        integrityEquipmentDetailsService.getEquipmentDetails({
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of equipment details: Fake unexpected server error'))
    })
  })
})
