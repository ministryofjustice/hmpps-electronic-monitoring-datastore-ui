import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

// TODO: bubble this down
import { OrderDetails } from '../interfaces/orderDetails'
import { OrderInformation } from '../interfaces/orderInformation'
import { OrderRequest } from '../types/OrderRequest'

export default class DatastoreOrderService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialised')
  }

  async getOrderSummary(input: OrderRequest): Promise<OrderInformation> {
    try {
      this.emDatastoreApiClient.updateToken(input.userToken)

      const result = await this.emDatastoreApiClient.getOrderSummary(input)

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
      this.emDatastoreApiClient.updateToken(input.userToken)
      const result = await this.emDatastoreApiClient.getOrderDetails(input)

      return result
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving order details')
      return error
    }
  }

  async confirmApi(token: string): Promise<JSON> {
    this.emDatastoreApiClient.updateToken(token)
    const result = this.emDatastoreApiClient.confirmApi()
    return result
  }
}
