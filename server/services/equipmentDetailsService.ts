import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

import { OrderRequest } from '../types/OrderRequest'
import { EquipmentDetails } from '../models/equipmentDetails'

export default class EquipmentDetailsService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialized')
  }

  async getEquipmentDetails(input: OrderRequest): Promise<EquipmentDetails[]> {
    this.emDatastoreApiClient.updateToken(input.userToken)

    let equipmentDetails = [] as EquipmentDetails[]
    try {
      equipmentDetails = await this.emDatastoreApiClient.getEquipmentDetails(input)
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving list of equipment details')
      throw error
    }

    return equipmentDetails
  }
}
