import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orders from '../data/mockData/orders'
import { Order } from '../interfaces/order'
import RestClient from '../data/restClient'

export default class SearchService {
  constructor(private readonly apiClient: RestClient) {}

  async getOrders(): Promise<Order[]> {
    try {
      return orders
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving search results')
      return error
    }
  }

  async testEndpoint() {
    const result = await this.apiClient.get({
      path: '/api/test-endpoint',
      token: "3",
    })

    return result
  }
}
