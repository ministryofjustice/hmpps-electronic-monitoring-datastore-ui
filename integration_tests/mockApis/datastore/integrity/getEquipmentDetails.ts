import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IntegrityEquipmentDetails } from '../../../../server/models/integrity/equipmentDetails'

const defaultEquipmentDetails = [] as IntegrityEquipmentDetails[]

type GetEquipmentDetailsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: IntegrityEquipmentDetails[]
}

export const stubIntegrityGetEquipmentDetails = (options: GetEquipmentDetailsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/integrity/${options.legacySubjectId}/equipment-details`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body || [...defaultEquipmentDetails] : undefined,
    },
  })

export default stubIntegrityGetEquipmentDetails
