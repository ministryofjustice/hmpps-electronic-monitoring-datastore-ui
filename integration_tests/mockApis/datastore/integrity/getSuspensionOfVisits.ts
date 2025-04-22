import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IntegritySuspensionOfVisitsEvent } from '../../../../server/models/integrity/suspensionOfVisits'

const defaultSuspensionOfVisitsEvent = {
  legacySubjectId: '123456789',
  suspensionOfVisits: 'Yes',
  requestedDate: '2001-01-01T01:01:01',
  startDate: '2001-01-01T01:01:01',
  startTime: '01:01:01',
  endDate: '2001-01-01T01:01:01',
} as IntegritySuspensionOfVisitsEvent

type GetSuspensionOfVisitsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: IntegritySuspensionOfVisitsEvent[]
}

export const stubIntegrityGetSuspensionOfVisits = (options: GetSuspensionOfVisitsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/integrity/${options.legacySubjectId}/suspension-of-visits`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? options.body || [
              {
                ...defaultSuspensionOfVisitsEvent,
                legacySubjectId: options.legacySubjectId,
              },
            ]
          : undefined,
    },
  })

export default stubIntegrityGetSuspensionOfVisits
