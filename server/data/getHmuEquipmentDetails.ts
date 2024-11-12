import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import hmuEquipmentDetails from './mockData/hmuEquipmentDetails'

const getEquipmentDetails = async () => {
  try {
    return hmuEquipmentDetails
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving hmu equipment details')
    return error
  }
}

export default getEquipmentDetails
