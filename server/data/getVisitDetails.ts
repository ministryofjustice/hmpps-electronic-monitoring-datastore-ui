import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import visitDetails from './mockData/visitDetails'

const getVisitDetails = async () => {
  try {
    return visitDetails
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving visit details')
    return error
  }
}

export default getVisitDetails
