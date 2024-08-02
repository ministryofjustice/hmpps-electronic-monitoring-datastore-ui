import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import visitsAndTasks from './mockData/visitsAndTasks'

const getVisitsAndTasks = async () => {
  try {
    return visitsAndTasks
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error retrieving visit and task details')
    return error
  }
}

export default getVisitsAndTasks
