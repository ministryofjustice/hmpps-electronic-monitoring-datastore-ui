import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { AlcoholMonitoringViolationEvent } from '../../../../server/models/alcoholMonitoring/violationEvents'

const defaultViolationEvents = [] as AlcoholMonitoringViolationEvent[]

type GetViolationEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: AlcoholMonitoringViolationEvent[]
}

export const stubAlcoholMonitoringGetViolationEvents = (options: GetViolationEventsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/alcohol-monitoring/${options.legacySubjectId}/violation-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body || [...defaultViolationEvents] : undefined,
    },
  })

export default stubAlcoholMonitoringGetViolationEvents
