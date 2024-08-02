import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orderDetails from './mockData/orderDetails'

const getOrderDetails = async () => {
  try {
    return orderDetails
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving order details')
    return error
  }
}

export default getOrderDetails
