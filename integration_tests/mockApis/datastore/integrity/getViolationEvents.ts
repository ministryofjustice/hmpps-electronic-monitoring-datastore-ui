import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { ViolationEvent } from '../../../../server/models/violationEvents'

const defaultViolationEventsStubOptions = {
  httpStatus: 200,
  legacySubjectId: 123456789,
  body: [],
} as GetViolationEventsStubOptions

type GetViolationEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: number
  body?: ViolationEvent[]
}

export const stubIntegrityGetViolationEvents = (
  options: GetViolationEventsStubOptions = defaultViolationEventsStubOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/integrity/orders/${options.legacySubjectId}/violation-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

export default stubIntegrityGetViolationEvents
