import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import { HmppsAuthClient, RestClientBuilder } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringEquipmentDetail } from '../../models/alcoholMonitoring/equipmentDetails'

export default class AlcoholMonitoringEquipmentDetailsService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialized')
  }

  async getEquipmentDetails(input: OrderRequest): Promise<AlcoholMonitoringEquipmentDetail[]> {
    try {
      this.emDatastoreApiClient.updateToken(input.userToken)
      return await this.emDatastoreApiClient.getAlcoholMonitoringEquipmentDetails(input)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of equipment details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
