import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import equipmentDetails from './mockData/equipmentDetails'

const getEquipmentDetails = async () => {
  try {
    return equipmentDetails
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving equipment details')
    return error
  }
}

export default getEquipmentDetails
