import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IntegrityServiceDetails } from '../../../../server/data/models/integrityServiceDetails'

const defaultServiceDetails = [] as IntegrityServiceDetails[]

type GetServiceDetailsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: IntegrityServiceDetails[]
}

export const stubIntegrityGetServiceDetails = (options: GetServiceDetailsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/integrity/${options.legacySubjectId}/service-details?restricted=false`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body || [...defaultServiceDetails] : undefined,
    },
  })

export default stubIntegrityGetServiceDetails
