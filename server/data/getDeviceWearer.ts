import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import deviceWearer from './mockData/deviceWearer'

const getDeviceWearerDetails = async () => {
  try {
    return deviceWearer
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving device wearer details')
    return error
  }
}

export default getDeviceWearerDetails
