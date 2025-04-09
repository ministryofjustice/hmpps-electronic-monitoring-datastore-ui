import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { AlcoholMonitoringOrderSummary } from '../../../../server/models/alcoholMonitoring/orderSummary'

const defaultOrderSummary: AlcoholMonitoringOrderSummary = {
  legacySubjectId: 'AAMR1234567',
  legacyOrderId: 'OMR1234',
  firstName: 'Testopher',
  lastName: 'Fakesmith',
  alias: 'an old tv show',
  dateOfBirth: '1950-01-01',
  address1: '123 Fourth Street',
  address2: 'Fiveton',
  address3: 'Sixbury',
  postcode: '7AB 8CD',
  orderStartDate: '2010-01-01T00:00:00',
  orderEndDate: '2030-01-01T00:00:00',
}

type GetOrderSummaryStubOptions = {
  httpStatus: number
  legacySubjectId: string
  body?: AlcoholMonitoringOrderSummary
}

export const stubAlcoholMonitoringGetOrderSummary = (options: GetOrderSummaryStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore/alcohol-monitoring/${options.legacySubjectId}/information`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body || defaultOrderSummary : null,
    },
  })

export default stubAlcoholMonitoringGetOrderSummary
