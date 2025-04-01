import { SuspensionOfVisitsEvent } from '../suspensionOfVisits'

export type SuspensionOfVisitsViewEvent = {
  isoDateTime: string
  eventType: string
  suspensionOfVisits: string
  requestedDate: string
  startDate: string
  startTime: string
  endDate: string
}

export type SuspensionOfVisitsViewModel = {
  legacySubjectId: number
  backUrl: string
  events: SuspensionOfVisitsViewEvent[]
}

const parseEvents = (events: SuspensionOfVisitsEvent[]): SuspensionOfVisitsViewEvent[] =>
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
  events: SuspensionOfVisitsEvent[],
): SuspensionOfVisitsViewModel => {
  return {
    legacySubjectId,
    backUrl: `/integrity/${legacySubjectId}/summary`,
    events: parseEvents(events),
  }
}

const construct = (legacySubjectId: number, events: SuspensionOfVisitsEvent[] = []): SuspensionOfVisitsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, events)
}

export default {
  construct,
}
