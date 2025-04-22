import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IntegritySuspensionOfVisitsEvent } from '../../../../server/models/integrity/suspensionOfVisits'

const defaultSuspensionOfVisitsDetails = {
  legacySubjectId: 123456789,
  suspensionOfVisits: 'Yes',
  requestedDate: '2001-01-01T01:01:01',
  startDate: '2001-01-01T01:01:01',
  startTime: '01:01:01',
  endDate: '2001-01-01T01:01:01',
}

/*

    ,
    {
      legacySubjectId: 123456789,
      suspensionOfVisits: 'Yes',
      requestedDate: '2002-02-02T02:02:02',
      startDate: '2002-02-02T02:02:02',
      startTime: '02:02:02',
      endDate: '2002-02-02T02:02:02',
    },
    {
      legacySubjectId: 123456789,
      suspensionOfVisits: 'Yes',
      requestedDate: '2003-03-03T03:03:03',
      startDate: '2003-03-03T03:03:03',
      startTime: '03:03:03',
      endDate: '2003-03-03T03:03:03',
    },
*/

const defaultGetSuspensionOfVisitsOptions = {
  httpStatus: 200,
  legacySubjectId: 123456789,
  body: [],
} as GetSuspensionOfVisitsStubOptions

type GetSuspensionOfVisitsStubOptions = {
  httpStatus: number
  legacySubjectId?: number
  body?: IntegritySuspensionOfVisitsEvent[]
}

export const stubIntegrityGetSuspensionOfVisits = (
  options: GetSuspensionOfVisitsStubOptions = defaultGetSuspensionOfVisitsOptions,
): SuperAgentRequest =>
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
                ...defaultSuspensionOfVisitsDetails,
                legacySubjectId: options.legacySubjectId,
              },
            ]
          : [],
    },
  })

export default stubIntegrityGetSuspensionOfVisits
