import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { ContactEvent } from '../../../../server/models/contactEvents'

const defaultContactEventsStubOptions = {
  httpStatus: 200,
  legacySubjectId: 123456789,
  body: [],
} as GetContactEventsStubOptions

type GetContactEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: number
  body?: ContactEvent[]
}

export const stubIntegrityGetContactEvents = (
  options: GetContactEventsStubOptions = defaultContactEventsStubOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/integrity/orders/${options.legacySubjectId}/contact-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

export default stubIntegrityGetContactEvents
