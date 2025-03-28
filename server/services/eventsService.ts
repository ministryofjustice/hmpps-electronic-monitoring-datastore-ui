import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

import { OrderRequest } from '../types/OrderRequest'
import { ContactEvent } from '../models/contactEvents'
import { IncidentEvent } from '../models/incidentEvents'
import { MonitoringEvent } from '../models/monitoringEvents'
import { ViolationEvent } from '../models/violationEvents'

export default class EventsService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialized')
  }

  async getEvents(input: OrderRequest): Promise<(ContactEvent | IncidentEvent | MonitoringEvent | ViolationEvent)[]> {
    this.emDatastoreApiClient.updateToken(input.userToken)

    let events = []
    try {
      events = await Promise.all([
        this.emDatastoreApiClient.getMonitoringEvents(input),
        this.emDatastoreApiClient.getIncidentEvents(input),
        this.emDatastoreApiClient.getContactEvents(input),
        this.emDatastoreApiClient.getViolationEvents(input),
      ])
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving list of events')
      throw error
    }

    return events.flat()
  }
}
