import logger from '../../logger'
import getSanitisedError from '../sanitisedError'

import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

import { OrderRequest } from '../types/OrderRequest'
import { ContactEvent } from '../models/contactEvents'
import { IncidentEvent } from '../models/incidentEvents'
import { MonitoringEvent } from '../models/monitoringEvents'
import { ViolationEvent } from '../models/violationEvents'

export default class EventsService {
  private readonly datastoreClient: DatastoreClient

  constructor(
    private readonly datastoreClientFactory: RestClientBuilder<DatastoreClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.datastoreClient = this.datastoreClientFactory('uninitialized')
  }

  async getEvents(input: OrderRequest): Promise<(ContactEvent | IncidentEvent | MonitoringEvent | ViolationEvent)[]> {
    this.datastoreClient.updateToken(input.accessToken)

    let events = []
    try {
      events = await Promise.all([
        this.datastoreClient.getMonitoringEvents(input),
        this.datastoreClient.getIncidentEvents(input),
        this.datastoreClient.getContactEvents(input),
        this.datastoreClient.getViolationEvents(input),
      ])
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving list of events')
      throw error
    }

    return events.flat()
  }
}
