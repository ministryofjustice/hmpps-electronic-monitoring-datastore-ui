import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IntegrityVisitDetails } from '../../../../server/models/integrity/visitDetails'

const defaultVisitDetailsStubOptions = {
  httpStatus: 200,
  legacySubjectId: 123456789,
  body: [],
} as GetVisitDetailsStubOptions

type GetVisitDetailsStubOptions = {
  httpStatus: number
  legacySubjectId?: number
  body?: IntegrityVisitDetails[]
}

export const stubIntegrityGetVisitDetails = (
  options: GetVisitDetailsStubOptions = defaultVisitDetailsStubOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/integrity/orders/${options.legacySubjectId}/visit-details`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

export default stubIntegrityGetVisitDetails
