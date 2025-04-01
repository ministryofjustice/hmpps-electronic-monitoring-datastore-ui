import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

export default class EmDatastoreConnectionService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialised')
  }

  async test(token: string): Promise<JSON> {
    try {
      this.emDatastoreApiClient.updateToken(token)
      return await this.emDatastoreApiClient.confirmApi()
    } catch (error) {
      const userFreindlyMessage = 'Error connecting to EM Datastore API'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
