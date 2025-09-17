import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { AlcoholMonitoringOrderDetails } from '../../../../server/data/models/alcoholMonitoringOrderDetails'

const defaultOrderDetails = {
  legacySubjectId: 'AA12345',
  firstName: 'John',
  lastName: 'Smith',
  alias: 'Zeno',
  dateOfBirth: '1980-02-01T00:00:00',
  sex: 'Sex',
  specialInstructions: 'Special instructions',
  phoneNumber: '09876543210',
  address1: '1 Primary Street',
  address2: 'Sutton',
  address3: 'London',
  postCode: 'ABC 123',
  orderStartDate: '2012-02-01T00:00:00',
  orderEndDate: '2013-04-03T00:00:00',
  enforceableCondition: 'Enforceable condition',
  orderType: 'Community',
  orderTypeDescription: '',
  orderEndOutcome: '',
  responsibleOrganisationPhoneNumber: '01234567890',
  responsibleOrganisationEmail: 'a@b.c',
  tagAtSource: '',
} as AlcoholMonitoringOrderDetails

type GetOrderDetailsStubOptions = {
  httpStatus: number
  legacySubjectId: string
  body?: AlcoholMonitoringOrderDetails
}

export const stubAlcoholMonitoringGetOrderDetails = (options: GetOrderDetailsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/alcohol-monitoring/${options.legacySubjectId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? options.body || {
              ...defaultOrderDetails,
              legacySubjectId: options.legacySubjectId || defaultOrderDetails.legacySubjectId,
            }
          : null,
    },
  })

export default stubAlcoholMonitoringGetOrderDetails
