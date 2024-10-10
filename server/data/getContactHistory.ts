import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import contactHistory from './mockData/contactHistory'

const getContactHistory = async () => {
  try {
    return contactHistory
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving contact history')
    return error
  }
}

export default getContactHistory
