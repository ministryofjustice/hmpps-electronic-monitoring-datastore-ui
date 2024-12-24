import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import { Order } from '../interfaces/order'
import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

// TODO: bubble this down
import { OrderInformation } from '../interfaces/orderInformation'
import { OrderRequest } from '../types/OrderRequest'

export default class DatastoreOrderService {
  private readonly datastoreClient: DatastoreClient

  constructor(
    private readonly datastoreClientFactory: RestClientBuilder<DatastoreClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.datastoreClient = this.datastoreClientFactory('uninitialised')
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
  async getOrderSummary(input: OrderRequest): Promise<OrderInformation> {
    try {
      this.datastoreClient.updateToken(input.userToken)

      const result = await this.datastoreClient.getOrderSummary(input)

      return result
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

  async confirmApi(orderParameter: string): Promise<JSON> {
    this.datastoreClient.updateToken(await this.hmppsAuthClient.getSystemClientToken())

    const result = this.datastoreClient.confirmApi(orderParameter)
    return result
  }
}
