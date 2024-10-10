import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import curfewHours from './mockData/curfewHours'

const getCurfewHours = async () => {
  try {
    return curfewHours
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving curfew information')
    return error
  }
}

export default getCurfewHours
