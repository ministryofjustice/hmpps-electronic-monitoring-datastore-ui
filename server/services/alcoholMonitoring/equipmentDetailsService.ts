import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { AlcoholMonitoringEquipmentDetails } from '../../data/models/alcoholMonitoringEquipmentDetails'

export default class AlcoholMonitoringEquipmentDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getEquipmentDetails(input: GetOrderRequest): Promise<AlcoholMonitoringEquipmentDetails[]> {
    try {
      const result = await this.emDatastoreApiClient.get<AlcoholMonitoringEquipmentDetails[]>({
        path: `/orders/alcohol-monitoring/${input.legacySubjectId}/equipment-details`,
        token: input.userToken,
      })

      return result.map(equipmentDetails => AlcoholMonitoringEquipmentDetails.parse(equipmentDetails))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of equipment details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
