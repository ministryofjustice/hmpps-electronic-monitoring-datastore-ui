import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

import { OrderRequest } from '../types/OrderRequest'
import { CurfewTimetable } from '../models/curfewTimetable'

export default class CurfewTimetableService {
  private readonly datastoreClient: DatastoreClient

  constructor(
    private readonly datastoreClientFactory: RestClientBuilder<DatastoreClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.datastoreClient = this.datastoreClientFactory('uninitialized')
  }

  async getCurfewTimetable(input: OrderRequest): Promise<CurfewTimetable[]> {
    this.datastoreClient.updateToken(input.userToken)

    let curfewTimetable = [] as CurfewTimetable[]
    try {
      curfewTimetable = await this.datastoreClient.getCurfewTimetable(input)
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving list of curfew timetables')
      throw error
    }

    return curfewTimetable
  }
}
