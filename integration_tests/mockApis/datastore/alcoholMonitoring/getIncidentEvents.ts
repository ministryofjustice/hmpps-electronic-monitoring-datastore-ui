import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { AlcoholMonitoringIncidentEvent } from '../../../../server/models/alcoholMonitoring/incidentEvents'

const defaultIncidentEventsStubOptions = {
  httpStatus: 200,
  legacySubjectId: 123456789,
  body: [],
} as GetIncidentEventsStubOptions

type GetIncidentEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: number
  body?: AlcoholMonitoringIncidentEvent[]
}

export const stubAlcoholMonitoringGetIncidentEvents = (
  options: GetIncidentEventsStubOptions = defaultIncidentEventsStubOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/alcohol-monitoring/${options.legacySubjectId}/incident-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

export default stubAlcoholMonitoringGetIncidentEvents
