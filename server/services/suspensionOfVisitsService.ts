import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

import { OrderRequest } from '../types/OrderRequest'
import { SuspensionOfVisits } from '../models/suspensionOfVisits'

export default class SuspensionOfVisitsService {
  private readonly datastoreClient: DatastoreClient

  constructor(
    private readonly datastoreClientFactory: RestClientBuilder<DatastoreClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.datastoreClient = this.datastoreClientFactory('uninitialized')
  }

  async getSuspensionOfVisits(input: OrderRequest): Promise<SuspensionOfVisits[]> {
    this.datastoreClient.updateToken(input.accessToken)

    let suspensionOfVisits = [] as SuspensionOfVisits[]
    try {
      suspensionOfVisits = await this.datastoreClient.getSuspensionOfVisits(input)
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving list of suspensions of visits')
      throw error
    }

    return suspensionOfVisits
  }
}
