import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IncidentEvents } from '../../../../server/models/incidentEvents'

const defaultIncidentEventsStubOptions = {
  httpStatus: 200,
  legacySubjectId: 123456789,
  body: [],
} as GetIncidentEventsStubOptions

type GetIncidentEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: number
  body?: IncidentEvents[]
}

export const stubIntegrityGetIncidentEvents = (
  options: GetIncidentEventsStubOptions = defaultIncidentEventsStubOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/integrity/orders/${options.legacySubjectId}/incident-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

export default stubIntegrityGetIncidentEvents
