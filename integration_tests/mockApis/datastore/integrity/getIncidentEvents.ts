import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IntegrityIncidentEvent } from '../../../../server/models/integrity/incidentEvents'

const defaultIncidentEvents = [] as IntegrityIncidentEvent[]

type GetIncidentEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: IntegrityIncidentEvent[]
}

export const stubIntegrityGetIncidentEvents = (options: GetIncidentEventsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/integrity/${options.legacySubjectId}/incident-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body || [...defaultIncidentEvents] : undefined,
    },
  })

export default stubIntegrityGetIncidentEvents
