import { AlcoholMonitoringDatastoreClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { AlcoholMonitoringContactEvent } from '../../data/models/alcoholMonitoringContactEvent'
import { AlcoholMonitoringIncidentEvent } from '../../data/models/alcoholMonitoringIncidentEvent'
import { AlcoholMonitoringViolationEvent } from '../../data/models/alcoholMonitoringViolationEvent'

export default class AlcoholMonitoringEventHistoryService {
  constructor(private readonly alcoholMonitoringDatastoreClient: AlcoholMonitoringDatastoreClient) {}

  async getEventHistory(
    input: GetOrderRequest,
  ): Promise<(AlcoholMonitoringContactEvent | AlcoholMonitoringIncidentEvent | AlcoholMonitoringViolationEvent)[]> {
    const { legacySubjectId, userToken } = input

    return (
      await Promise.all([
        this.alcoholMonitoringDatastoreClient
          .getContactEvents(legacySubjectId, userToken)
          .then(contactEvents => contactEvents.map(contactEvent => AlcoholMonitoringContactEvent.parse(contactEvent))),

        this.alcoholMonitoringDatastoreClient
          .getIncidentEvents(legacySubjectId, userToken)
          .then(incidentEvents =>
            incidentEvents.map(incidentEvent => AlcoholMonitoringIncidentEvent.parse(incidentEvent)),
          ),

        this.alcoholMonitoringDatastoreClient
          .getViolationEvents(legacySubjectId, userToken)
          .then(violationEvents =>
            violationEvents.map(violationEvent => AlcoholMonitoringViolationEvent.parse(violationEvent)),
          ),
      ])
    ).flat()
  }
}
