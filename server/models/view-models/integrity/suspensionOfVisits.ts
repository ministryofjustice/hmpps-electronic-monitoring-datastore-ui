import { IntegritySuspensionOfVisitsEvent } from '../../integrity/suspensionOfVisits'

export type IntegritySuspensionOfVisitsViewEvent = {
  isoDateTime: string
  eventType: string
  suspensionOfVisits: string
  requestedDate: string
  startDate: string
  startTime: string
  endDate: string
}

export type IntegritySuspensionOfVisitsViewModel = {
  legacySubjectId: number
  backUrl: string
  events: IntegritySuspensionOfVisitsViewEvent[]
}

const parseEvents = (events: IntegritySuspensionOfVisitsEvent[]): IntegritySuspensionOfVisitsViewEvent[] =>
  events
    .sort((a, b) => new Date(a.requestedDate).getTime() - new Date(b.requestedDate).getTime())
    .map(event => {
      return {
        isoDateTime: event.requestedDate,
        eventType: 'suspension-of-visits',
        suspensionOfVisits: event.suspensionOfVisits,
        requestedDate: event.requestedDate,
        startDate: event.startDate,
        startTime: event.startTime,
        endDate: event.endDate,
      }
    })

const createViewModelFromApiDto = (
  legacySubjectId: number,
  backUrl: string,
  events: IntegritySuspensionOfVisitsEvent[],
): IntegritySuspensionOfVisitsViewModel => {
  return {
    legacySubjectId,
    backUrl,
    events: parseEvents(events),
  }
}

const construct = (
  legacySubjectId: number,
  backUrl: string,
  events: IntegritySuspensionOfVisitsEvent[] = [],
): IntegritySuspensionOfVisitsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, events)
}

export default {
  construct,
}
