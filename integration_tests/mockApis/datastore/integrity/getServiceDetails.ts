import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IntegrityServiceDetail } from '../../../../server/models/integrity/serviceDetail'

const defaultServiceDetailsStubOptions = {
  httpStatus: 200,
  legacySubjectId: 123456789,
  body: [],
}

type GetServiceDetailsStubOptions = {
  httpStatus: number
  legacySubjectId?: number
  body?: IntegrityServiceDetail[]
}

export const stubIntegrityGetServiceDetails = (
  options: GetServiceDetailsStubOptions = defaultServiceDetailsStubOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/integrity/orders/${options.legacySubjectId}/service-details`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

export default stubIntegrityGetServiceDetails
