import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { AlcoholMonitoringServiceDetails } from '../../../../server/models/alcoholMonitoring/serviceDetails'

const defaultServiceDetails: AlcoholMonitoringServiceDetails = {
  legacySubjectId: 'AAMR123',
  serviceStartDate: '2001-01-01T00:00:00',
  serviceEndDate: '2002-02-02T00:00:00',
  serviceAddress: 'service address',
  equipmentStartDate: '2003-03-03T00:00:00',
  equipmentEndDate: '2004-04-04T00:00:00',
  hmuSerialNumber: 'hmu-01',
  deviceSerialNumber: 'device-01',
}

type GetServiceDetailsStubOptions = {
  httpStatus: number
  legacySubjectId: string
  body?: AlcoholMonitoringServiceDetails[]
}

export const stubAlcoholMonitoringGetServiceDetails = (options: GetServiceDetailsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/alcohol-monitoring/${options.legacySubjectId}/services`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? options.body || [
              {
                ...defaultServiceDetails,
                legacySubjectId: options.legacySubjectId,
              },
            ]
          : [],
    },
  })

export default stubAlcoholMonitoringGetServiceDetails
