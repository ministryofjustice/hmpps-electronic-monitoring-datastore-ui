import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { MonitoringEvents } from '../../../../server/models/monitoringEvents'

const defaultVisitDetailsStubOptions = {
  httpStatus: 200,
  legacySubjectId: 123456789,
  body: [],
} as GetVisitDetailsStubOptions

type GetVisitDetailsStubOptions = {
  httpStatus: number
  legacySubjectId?: number
  body?: MonitoringEvents[]
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
