// This mock fetches data from a local file. It will be replaced with a script that requests orders from AWS Athena, either directly or via middleware.

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
