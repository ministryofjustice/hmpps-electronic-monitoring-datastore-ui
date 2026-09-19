import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IntegritySuspensionOfVisits } from '../../../../server/data/models/integritySuspensionOfVisits'

const defaultSuspensionOfVisitsEvent = {
  legacySubjectId: '123456789',
  suspensionOfVisits: 'Yes',
  requestedDate: '2001-01-01T01:01:01',
  startDate: '2001-01-01T01:01:01',
  startTime: '01:01:01',
  endDate: '2001-01-01T01:01:01',
} as IntegritySuspensionOfVisits

type GetSuspensionOfVisitsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: IntegritySuspensionOfVisits[]
}

export const stubIntegrityGetSuspensionOfVisits = (options: GetSuspensionOfVisitsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/integrity/${options.legacySubjectId}/suspension-of-visits?restricted=false`,
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
