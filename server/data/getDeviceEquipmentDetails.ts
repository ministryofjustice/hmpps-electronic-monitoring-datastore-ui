import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import deviceEquipmentDetails from './mockData/deviceEquipmentDetails'

const getEquipmentDetails = async () => {
  try {
    return deviceEquipmentDetails
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving device equipment details')
    return error
  }
}

export default getEquipmentDetails
