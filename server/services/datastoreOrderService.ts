import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

// TODO: bubble this down
import { OrderDetails } from '../interfaces/orderDetails'
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

  async getOrderSummary(input: OrderRequest): Promise<OrderInformation> {
    try {
      this.datastoreClient.updateToken(input.userToken)

      const result = await this.datastoreClient.getOrderSummary(input)

      return result
    } catch (error) {
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, 'Error retrieving order')
      sanitisedError.message = `Error retrieving order: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
  /**
   * Change getOrders signature to accept search criteria
   * Method should get token and pass to searchfactory
   * await getOrders
   */

  async getOrderDetails(input: OrderRequest): Promise<OrderDetails> {
    try {
      this.datastoreClient.updateToken(input.userToken)
      const result = await this.datastoreClient.getOrderDetails(input)

      return result
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving order details')
      return error
    }
  }

  async confirmApi(token: string): Promise<JSON> {
    this.datastoreClient.updateToken(token)
    const result = this.datastoreClient.confirmApi()
    return result
  }
}
