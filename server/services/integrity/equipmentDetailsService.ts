import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegrityEquipmentDetails } from '../../data/models/integrityEquipmentDetails'

export default class IntegrityEquipmentDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getEquipmentDetails(input: GetOrderRequest): Promise<IntegrityEquipmentDetails[]> {
    const { restricted } = input

    try {
      const results = await this.emDatastoreApiClient.get<IntegrityEquipmentDetails[]>({
        path: `/orders/integrity/${input.legacySubjectId}/equipment-details`,
        query: { restricted },
        token: input.userToken,
      })

      return results.map(equipmentDetails => IntegrityEquipmentDetails.parse(equipmentDetails))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of equipment details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
