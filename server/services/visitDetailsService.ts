import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

import { OrderRequest } from '../types/OrderRequest'
import { VisitDetails } from '../models/visitDetails'

export default class VisitDetailsService {
  private readonly datastoreClient: DatastoreClient

  constructor(
    private readonly datastoreClientFactory: RestClientBuilder<DatastoreClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.datastoreClient = this.datastoreClientFactory('uninitialized')
  }

  async getVisitDetails(input: OrderRequest): Promise<VisitDetails[]> {
    this.datastoreClient.updateToken(input.accessToken)

    let visitDetails = [] as VisitDetails[]
    try {
      visitDetails = await this.datastoreClient.getVisitDetails(input)
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving list of equipment details')
      throw error
    }

    return visitDetails
  }
}
