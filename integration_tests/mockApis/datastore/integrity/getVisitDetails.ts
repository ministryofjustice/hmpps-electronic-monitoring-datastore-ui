import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IntegrityVisitDetails } from '../../../../server/data/models/integrityVisitDetails'

const defaultVisitDetails = [] as IntegrityVisitDetails[]

type GetVisitDetailsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: IntegrityVisitDetails[]
}

export const stubIntegrityGetVisitDetails = (options: GetVisitDetailsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/integrity/${options.legacySubjectId}/visit-details?restricted=false`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body || [...defaultVisitDetails] : undefined,
    },
  })

export default stubIntegrityGetVisitDetails
