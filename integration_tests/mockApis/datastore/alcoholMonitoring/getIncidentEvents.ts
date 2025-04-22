import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { AlcoholMonitoringIncidentEvent } from '../../../../server/models/alcoholMonitoring/incidentEvents'

const defaultIncidentEvents = [] as AlcoholMonitoringIncidentEvent[]

type GetIncidentEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: AlcoholMonitoringIncidentEvent[]
}

export const stubAlcoholMonitoringGetIncidentEvents = (options: GetIncidentEventsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/alcohol-monitoring/${options.legacySubjectId}/incident-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body || [...defaultIncidentEvents] : undefined,
    },
  })

export default stubAlcoholMonitoringGetIncidentEvents
