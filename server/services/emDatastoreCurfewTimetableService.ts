import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

import { OrderRequest } from '../types/OrderRequest'
import { CurfewTimetable } from '../models/curfewTimetable'

export default class EmDatastoreCurfewTimetableService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialized')
  }

  async getCurfewTimetable(input: OrderRequest): Promise<CurfewTimetable[]> {
    try {
      this.emDatastoreApiClient.updateToken(input.userToken)
      return this.emDatastoreApiClient.getCurfewTimetable(input)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving curfew timetable'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
