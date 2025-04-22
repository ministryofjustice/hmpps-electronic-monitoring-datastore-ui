import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { IntegrityMonitoringEvent } from '../../../../server/models/integrity/monitoringEvents'

const defaultMonitoringEvents = [] as IntegrityMonitoringEvent[]

type GetMonitoringEventsStubOptions = {
  httpStatus: number
  legacySubjectId?: string
  body?: IntegrityMonitoringEvent[]
}

export const stubIntegrityGetMonitoringEvents = (options: GetMonitoringEventsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/integrity/${options.legacySubjectId}/monitoring-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body || [...defaultMonitoringEvents] : undefined,
    },
  })

export default stubIntegrityGetMonitoringEvents
