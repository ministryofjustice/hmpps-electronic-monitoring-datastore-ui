import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orders from '../data/mockData/orders'
import { Order } from '../interfaces/order'
import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

export default class DatastoreOrderService {
  constructor(
    private readonly datastoreClientFactory: RestClientBuilder<DatastoreClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {}

  async getOrders(criteria: Order): Promise<Order[]> {
    try {
      return orders
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving search results')
      return error
    }
  }

  // place holder to ensure that we're returning something.
  // temporary before we wire up the api endpoints.
  async getCases(criteria: Order): Promise<Order> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const datastoreClient = this.datastoreClientFactory(token)

    const result = datastoreClient.getCases(criteria)
    return result
  }

  /**
   * Change getOrders signature to accept search criteria
   * Method should get token and pass to searchfactory
   * await getOrders
   */
}
