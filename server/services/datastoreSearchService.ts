import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orders from '../data/mockData/orders'
import { Order } from '../interfaces/order'
import DatastoreSearchClient from '../data/datastoreSearchClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

export default class DatastoreSearchService {
  constructor(
    private readonly datastoreSearchClientFactory: RestClientBuilder<DatastoreSearchClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {}

  async getOrders(): Promise<Order[]> {
    try {
      return orders
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving search results')
      return error
    }
  }
}
