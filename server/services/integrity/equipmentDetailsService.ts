import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityEquipmentDetails } from '../../models/integrity/equipmentDetails'

export default class IntegrityEquipmentDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getEquipmentDetails(input: OrderRequest): Promise<IntegrityEquipmentDetails[]> {
    try {
      return await this.emDatastoreApiClient.getIntegrityEquipmentDetails(input, input.userToken)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of equipment details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
