import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orderSummary from '../data/mockData/orderSummary'
import { OrderSummary } from '../interfaces/orderSummary'

export default class OrderService {
  async getOrderSummary(): Promise<OrderSummary> {
    try {
      return orderSummary
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving order')
      return error
    }
  }
}
