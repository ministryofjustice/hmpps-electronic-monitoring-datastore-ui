// This mock fetches data from a local file. It will be replaced with a script that requests orders from AWS Athena, either directly or via middleware.

import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orders from './mockData/orders'

const getOrders = async () => {
  try {
    return orders
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving search results')
    return error
  }
}

export default getOrders
