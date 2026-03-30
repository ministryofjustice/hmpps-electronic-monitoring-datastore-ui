import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import IntegrityEquipmentDetailsService from './equipmentDetailsService'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import config from '../../config'
import { IntegrityEquipmentDetails } from '../../data/models/integrityEquipmentDetails'

describe('Integrity Equipment Details Service', () => {
  let exampleEmDatastoreApiClient: EmDatastoreApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  let integrityEquipmentDetailsService: IntegrityEquipmentDetailsService

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('unused-test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    exampleEmDatastoreApiClient = new EmDatastoreApiClient(mockAuthenticationClient)
    integrityEquipmentDetailsService = new IntegrityEquipmentDetailsService(exampleEmDatastoreApiClient)
  })

  afterEach(() => {
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

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/equipment-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integrityEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
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

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/equipment-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integrityEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
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

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/equipment-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integrityEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of equipment detail items', async () => {
      const expectedResult = [] as IntegrityEquipmentDetails[]

      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/equipment-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, expectedResult)

      const result = await integrityEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
        legacySubjectId: `${legacySubjectId}`,
      })

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/equipment-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(401)

      await expect(
        integrityEquipmentDetailsService.getEquipmentDetails({
          userToken: 'test-system-token',
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of equipment details: Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/orders/integrity/${legacySubjectId}/equipment-details`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(500)
        .persist()

      await expect(
        integrityEquipmentDetailsService.getEquipmentDetails({
          userToken: 'test-system-token',
          legacySubjectId: `${legacySubjectId}`,
        }),
      ).rejects.toEqual(new Error('Error retrieving list of equipment details: Internal Server Error'))
    })
  })
})
