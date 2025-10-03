import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IntegrityViolationEvent } from '../../../../server/data/models/integrityViolationEvent'

const defaultViolationEvents = [] as IntegrityViolationEvent[]

type GetViolationEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: IntegrityViolationEvent[]
}

export const stubIntegrityGetViolationEvents = (options: GetViolationEventsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/integrity/${options.legacySubjectId}/violation-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body || [...defaultViolationEvents] : undefined,
    },
  })

export default stubIntegrityGetViolationEvents
