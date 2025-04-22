import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { OrderDetails } from '../../../../server/models/orderDetails'

const defaultOrderDetails = {
  specials: 'no',
  legacySubjectId: '1234567',
  firstName: null,
  lastName: null,
  alias: null,
  dateOfBirth: null,
  adultOrChild: null,
  sex: null,
  contact: null,
  primaryAddressLine1: null,
  primaryAddressLine2: null,
  primaryAddressLine3: null,
  primaryAddressPostCode: null,
  phoneOrMobileNumber: null,
  ppo: null,
  mappa: null,
  technicalBail: null,
  manualRisk: null,
  offenceRisk: false,
  postCodeRisk: null,
  falseLimbRisk: null,
  migratedRisk: null,
  rangeRisk: null,
  reportRisk: null,
  orderStartDate: null,
  orderEndDate: null,
  orderType: null,
  orderTypeDescription: null,
  orderTypeDetail: null,
  wearingWristPid: null,
  notifyingOrganisationDetailsName: null,
  responsibleOrganisation: null,
  responsibleOrganisationDetailsRegion: null,
}

type GetOrderDetailsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: OrderDetails
}

export const stubIntegrityGetOrderDetails = (options: GetOrderDetailsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/integrity/${options.legacySubjectId}/details`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? options.body || {
              ...defaultOrderDetails,
              legacySubjectId: options.legacySubjectId,
            }
          : undefined,
    },
  })

export default stubIntegrityGetOrderDetails
