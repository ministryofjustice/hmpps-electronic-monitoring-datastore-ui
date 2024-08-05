import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import curfewViolations from './mockData/curfewViolations'

const getCurfewViolations = async () => {
  try {
    return curfewViolations
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving curfew violations')
    return error
  }
}

export default getCurfewViolations
