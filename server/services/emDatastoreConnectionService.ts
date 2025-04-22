import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import EmDatastoreApiClient from '../data/emDatastoreApiClient'

export default class EmDatastoreConnectionService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async test(token: string): Promise<JSON> {
    try {
      return await this.emDatastoreApiClient.get<JSON>({
        path: '/test',
        token,
      })
    } catch (error) {
      const userFreindlyMessage = 'Error connecting to EM Datastore API'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
