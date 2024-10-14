// This mock fetches data from a local file. It will be replaced with a script that requests orders from AWS Athena, either directly or via middleware.

import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orderSummary from './mockData/orderSummary'

const getOrderSummary = async () => {
  try {
    return orderSummary
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving order summary')
    return error
  }
}

export default getOrderSummary
