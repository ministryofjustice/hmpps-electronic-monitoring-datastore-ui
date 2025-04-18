import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IntegrityEquipmentDetails } from '../../../../server/models/integrity/equipmentDetails'

const defaultEquipmentDetailsStubOptions = {
  httpStatus: 200,
  legacySubjectId: 123456789,
  body: [],
} as GetEquipmentDetailsStubOptions

type GetEquipmentDetailsStubOptions = {
  httpStatus: number
  legacySubjectId?: number
  body?: IntegrityEquipmentDetails[]
}

export const stubIntegrityGetEquipmentDetails = (
  options: GetEquipmentDetailsStubOptions = defaultEquipmentDetailsStubOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/integrity/${options.legacySubjectId}/equipment-details`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

export default stubIntegrityGetEquipmentDetails
