import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import suspensions from './mockData/suspensions'

const getSuspensions = async () => {
  try {
    return suspensions
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving search results')
    return error
  }
}

export default getSuspensions
