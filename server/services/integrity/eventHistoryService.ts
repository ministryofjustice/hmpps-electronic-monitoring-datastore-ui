import { IntegrityDatastoreClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegrityContactEvent } from '../../data/models/integrityContactEvent'
import { IntegrityIncidentEvent } from '../../data/models/integrityIncidentEvent'
import { IntegrityMonitoringEvent } from '../../data/models/integrityMonitoringEvent'
import { IntegrityViolationEvent } from '../../data/models/integrityViolationEvent'

export default class IntegrityEventHistoryService {
  constructor(private readonly integrityDatastoreClient: IntegrityDatastoreClient) {}

  async getEventHistory(
    input: GetOrderRequest,
  ): Promise<(IntegrityContactEvent | IntegrityIncidentEvent | IntegrityMonitoringEvent | IntegrityViolationEvent)[]> {
    const { legacySubjectId, userToken, restricted } = input

    return (
      await Promise.all([
        this.integrityDatastoreClient
          .getMonitoringEvents(legacySubjectId, userToken, restricted)
          .then(events => events.map(event => IntegrityMonitoringEvent.parse(event))),

        this.integrityDatastoreClient
          .getIncidentEvents(legacySubjectId, userToken, restricted)
          .then(events => events.map(event => IntegrityIncidentEvent.parse(event))),

        this.integrityDatastoreClient
          .getContactEvents(legacySubjectId, userToken, restricted)
          .then(events => events.map(event => IntegrityContactEvent.parse(event))),

        this.integrityDatastoreClient
          .getViolationEvents(legacySubjectId, userToken, restricted)
          .then(events => events.map(event => IntegrityViolationEvent.parse(event))),
      ])
    ).flat()
  }
}
