import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

import { OrderRequest } from '../types/OrderRequest'
import { EquipmentDetails } from '../models/equipmentDetails'

export default class EquipmentDetailsService {
  private readonly datastoreClient: DatastoreClient

  constructor(
    private readonly datastoreClientFactory: RestClientBuilder<DatastoreClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.datastoreClient = this.datastoreClientFactory('uninitialized')
  }

  async getEquipmentDetails(input: OrderRequest): Promise<EquipmentDetails[]> {
    this.datastoreClient.updateToken(input.accessToken)

    let equipmentDetails = [] as EquipmentDetails[]
    try {
      equipmentDetails = await this.datastoreClient.getEquipmentDetails(input)
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving list of equipment details')
      throw error
    }

    return equipmentDetails
  }
}
