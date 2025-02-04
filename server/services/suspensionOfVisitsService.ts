import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

import { OrderRequest } from '../types/OrderRequest'
import { SuspensionOfVisitsEvent } from '../models/suspensionOfVisits'

export default class SuspensionOfVisitsService {
  private readonly datastoreClient: DatastoreClient

  constructor(
    private readonly datastoreClientFactory: RestClientBuilder<DatastoreClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.datastoreClient = this.datastoreClientFactory('uninitialized')
  }

  async getSuspensionOfVisitsEvents(input: OrderRequest): Promise<SuspensionOfVisitsEvent[]> {
    this.datastoreClient.updateToken(input.accessToken)

    try {
      this.datastoreClient.updateToken(input.accessToken)
      const result = await this.datastoreClient.getSuspensionOfVisits(input)
      return result
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving suspension of visits data')
      throw error
    }
  }
}
