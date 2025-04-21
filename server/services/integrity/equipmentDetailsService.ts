import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityEquipmentDetails, IntegrityEquipmentDetailsModel } from '../../models/integrity/equipmentDetails'

export default class IntegrityEquipmentDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getEquipmentDetails(input: OrderRequest): Promise<IntegrityEquipmentDetails[]> {
    try {
      const results = await this.emDatastoreApiClient.get<IntegrityEquipmentDetails[]>({
        path: `/orders/integrity/${input.legacySubjectId}/equipment-details`,
        token: input.legacySubjectId,
      })

      return results.map(equipmentDetails => IntegrityEquipmentDetailsModel.parse(equipmentDetails))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of equipment details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
