import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

import { OrderRequest } from '../types/OrderRequest'
import { CurfewTimetable } from '../models/curfewTimetable'

export default class CurfewTimetableService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialized')
  }

  async getCurfewTimetable(input: OrderRequest): Promise<CurfewTimetable[]> {
    this.emDatastoreApiClient.updateToken(input.userToken)

    let curfewTimetable = [] as CurfewTimetable[]
    try {
      curfewTimetable = await this.emDatastoreApiClient.getCurfewTimetable(input)
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving list of curfew timetables')
      throw error
    }

    return curfewTimetable
  }
}
