import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { AlcoholMonitoringContactEvent } from '../../../../server/models/alcoholMonitoring/contactEvents'

const defaultContactEventsStubOptions = {
  httpStatus: 200,
  legacySubjectId: '123456789',
  body: [],
} as GetContactEventsStubOptions

type GetContactEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: AlcoholMonitoringContactEvent[]
}

export const stubAlcoholMonitoringGetContactEvents = (
  options: GetContactEventsStubOptions = defaultContactEventsStubOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/alcohol-monitoring/${options.legacySubjectId}/contact-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

export default stubAlcoholMonitoringGetContactEvents
