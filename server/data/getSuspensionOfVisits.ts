import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import suspensionOfVisits from './mockData/suspensionOfVisits'

const getSuspensionOfVisits = async () => {
  try {
    return suspensionOfVisits
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving search results')
    return error
  }
}

export default getSuspensionOfVisits
