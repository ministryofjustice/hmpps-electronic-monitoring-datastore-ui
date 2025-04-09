import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { MonitoringEvents } from '../../../../server/models/monitoringEvents'

const defaultMonitoringEventsStubOptions = {
  httpStatus: 200,
  legacySubjectId: 123456789,
  body: [],
} as GetMonitoringEventsStubOptions

type GetMonitoringEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: number
  body?: MonitoringEvents[]
}

export const stubIntegrityGetMonitoringEvents = (
  options: GetMonitoringEventsStubOptions = defaultMonitoringEventsStubOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/integrity/orders/${options.legacySubjectId}/monitoring-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

export default stubIntegrityGetMonitoringEvents
