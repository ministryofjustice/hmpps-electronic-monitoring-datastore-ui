import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringEquipmentDetails } from '../../models/alcoholMonitoring/equipmentDetails'

export default class AlcoholMonitoringEquipmentDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getEquipmentDetails(input: OrderRequest): Promise<AlcoholMonitoringEquipmentDetails[]> {
    try {
      return await this.emDatastoreApiClient.getAlcoholMonitoringEquipmentDetails(input, input.userToken)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of equipment details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
