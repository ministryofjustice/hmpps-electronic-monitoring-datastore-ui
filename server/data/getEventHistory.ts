import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import eventHistory from './mockData/eventHistory'

const getEventHistory = async () => {
  try {
    return eventHistory
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving search results')
    return error
  }
}

export default getEventHistory
