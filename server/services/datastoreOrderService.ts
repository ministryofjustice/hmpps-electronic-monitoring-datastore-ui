import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orders from '../data/mockData/orders'
import { Order } from '../interfaces/order'
import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

// TODO: bubble this down
import orderSummary from '../data/mockData/orderSummary'
import { OrderSummary } from '../interfaces/orderSummary'

export default class DatastoreOrderService {
  private readonly datastoreClient: DatastoreClient

  constructor(
    private readonly datastoreClientFactory: RestClientBuilder<DatastoreClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.datastoreClient = this.datastoreClientFactory('uninitialised')
  }

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
  // TODO: Add try ... catch here instead of bubbling all the way up to top level handler
  async getCases(criteria: Order): Promise<Order> {
    this.datastoreClient.updateToken(await this.hmppsAuthClient.getSystemClientToken())

    const result = this.datastoreClient.getCases(criteria)
    return result
  }

  // TODO: remember to add updatetoken here
  async getOrderSummary(): Promise<OrderSummary> {
    try {
      return orderSummary
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving order')
      return error
    }
  }
  /**
   * Change getOrders signature to accept search criteria
   * Method should get token and pass to searchfactory
   * await getOrders
   */
}
