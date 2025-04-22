import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import {
  KeyOrderInformation,
  SubjectHistoryReport,
  OrderDocument,
} from '../../../../server/models/integrity/orderSummary'

const defaultGetOrderSummaryOptions = {
  httpStatus: 200,
  legacySubjectId: '123456789',
  keyOrderInformation: {
    specials: 'no',
    legacySubjectId: '1234567',
    name: 'Testopher Fakesmith',
    alias: 'an old tv show',
    dateOfBirth: '1950-01-01',
    postcode: '7AB 8CD',
    address1: '123 Fourth Street',
    address2: 'Fiveton',
    address3: 'Sixbury',
    orderStartDate: '2010-01-01T00:00:00',
    orderEndDate: '2030-01-01T00:00:00',
  },
  subjectHistoryReport: {
    reportUrl: '',
    name: '',
    createdOn: '',
    time: '',
  },
  documents: {
    pageSize: 1,
    orderDocuments: [],
  },
} as GetOrderSummaryStubOptions

type GetOrderSummaryStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  keyOrderInformation?: KeyOrderInformation
  subjectHistoryReport?: SubjectHistoryReport
  documents?: {
    pageSize: number
    orderDocuments: OrderDocument[]
  }
}

export const stubIntegrityGetOrderSummary = (
  options: GetOrderSummaryStubOptions = defaultGetOrderSummaryOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore/orders/integrity/${options.legacySubjectId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              keyOrderInformation: options.keyOrderInformation,
              subjectHistoryReport: options.subjectHistoryReport,
              documents: options.documents,
            }
          : null,
    },
  })

export default stubIntegrityGetOrderSummary
