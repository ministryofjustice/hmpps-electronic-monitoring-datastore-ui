import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orderInformation from '../data/mockData/orderInformation'
import { OrderInformation } from '../interfaces/orderInformation'

export default class OrderService {
  async getOrderInformation(): Promise<OrderInformation> {
    try {
      return orderInformation
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving order')
      return error
    }
  }
}
