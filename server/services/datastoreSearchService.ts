import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import { Order } from '../interfaces/order'
import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

export default class DatastoreSearchService {
  private readonly datastoreClient: DatastoreClient

  constructor(
    private readonly datastoreClientFactory: RestClientBuilder<DatastoreClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.datastoreClient = this.datastoreClientFactory('uninitialised')
  }

  async getOrders(criteria: Order): Promise<Order[]> {
    try {
      this.datastoreClient.updateToken(await this.hmppsAuthClient.getSystemClientToken())

      const results = this.datastoreClient.searchForOrders(criteria)
      return results
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving search results')
      return error
    }
  }
}
