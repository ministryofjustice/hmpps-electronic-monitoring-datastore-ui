import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { AlcoholMonitoringViolationEvent } from '../../../../server/models/alcoholMonitoring/violationEvents'

const defaultViolationEventsStubOptions = {
  httpStatus: 200,
  legacySubjectId: '123456789',
  body: [],
} as GetViolationEventsStubOptions

type GetViolationEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: AlcoholMonitoringViolationEvent[]
}

export const stubAlcoholMonitoringGetViolationEvents = (
  options: GetViolationEventsStubOptions = defaultViolationEventsStubOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/alcohol-monitoring/${options.legacySubjectId}/violation-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

export default stubAlcoholMonitoringGetViolationEvents
