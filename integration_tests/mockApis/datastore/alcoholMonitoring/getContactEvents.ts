import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { AlcoholMonitoringContactEvent } from '../../../../server/data/models/alcoholMonitoringContactEvent'

const defaultContactEvents = [] as AlcoholMonitoringContactEvent[]

type GetContactEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: AlcoholMonitoringContactEvent[]
}

export const stubAlcoholMonitoringGetContactEvents = (options: GetContactEventsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/alcohol-monitoring/${options.legacySubjectId}/contact-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body || [...defaultContactEvents] : undefined,
    },
  })

export default stubAlcoholMonitoringGetContactEvents
