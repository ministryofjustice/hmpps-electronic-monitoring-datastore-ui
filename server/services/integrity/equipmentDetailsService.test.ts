import { IntegrityDatastoreClient } from '../../data'
import IntegrityEquipmentDetailsService from './equipmentDetailsService'

jest.mock('../../data')

describe('Integrity equipment details Service', () => {
  let integrityDatastoreClient: IntegrityDatastoreClient
  let integrityEquipmentDetailsService: IntegrityEquipmentDetailsService

  beforeEach(() => {
    integrityDatastoreClient = {
      getEquipmentDetails: jest.fn(),
    } as unknown as jest.Mocked<IntegrityDatastoreClient>
    integrityEquipmentDetailsService = new IntegrityEquipmentDetailsService(integrityDatastoreClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEquipmentDetails', () => {
    it('should fetch a list of one equipment detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId: 'equipment_details_001',
        },
      ]

      integrityDatastoreClient.getEquipmentDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await integrityEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'equipment_details_001',
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple equipment detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId: 'equipment_details_002',
        },
        {
          legacySubjectId: '456',
        },
        {
          legacySubjectId: '789',
        },
      ]

      integrityDatastoreClient.getEquipmentDetails = jest.fn().mockResolvedValue(expectedResult)

      const result = await integrityEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'equipment_details_002',
      })

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of equipment detail items', async () => {
      integrityDatastoreClient.getEquipmentDetails = jest.fn().mockResolvedValue([])

      const result = await integrityEquipmentDetailsService.getEquipmentDetails({
        userToken: 'test-system-token',
        legacySubjectId: 'equipment_details_003',
      })

      expect(result).toEqual([])
    })

    it('should propagate an error if there is an authorization error', async () => {
      integrityDatastoreClient.getEquipmentDetails = jest.fn().mockRejectedValue(new Error('Unauthorized'))

      await expect(
        integrityEquipmentDetailsService.getEquipmentDetails({
          userToken: 'test-system-token',
          legacySubjectId: 'equipment_details_004',
        }),
      ).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      integrityDatastoreClient.getEquipmentDetails = jest.fn().mockRejectedValue(new Error('Internal Server Error'))

      await expect(
        integrityEquipmentDetailsService.getEquipmentDetails({
          userToken: 'test-system-token',
          legacySubjectId: 'equipment_details_005',
        }),
      ).rejects.toEqual(new Error('Internal Server Error'))
    })
  })
})
