import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

import { OrderRequest } from '../types/OrderRequest'
import { VisitDetails } from '../models/visitDetails'

export default class VisitDetailsService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialized')
  }

  async getVisitDetails(input: OrderRequest): Promise<VisitDetails[]> {
    this.emDatastoreApiClient.updateToken(input.userToken)

    let visitDetails = [] as VisitDetails[]
    try {
      visitDetails = await this.emDatastoreApiClient.getVisitDetails(input)
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving list of visit details')
      throw error
    }

    return visitDetails
  }
}
