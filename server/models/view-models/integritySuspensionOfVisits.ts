import { IntegritySuspensionOfVisits } from '../../data/models/integritySuspensionOfVisits'

export type IntegritySuspensionOfVisitsViewEvent = {
  isoDateTime?: string | null
  eventType?: string | null
  suspensionOfVisits?: string | null
  requestedDate?: string | null
  startDate?: string | null
  startTime?: string | null
  endDate?: string | null
}

export type IntegritySuspensionOfVisitsView = {
  legacySubjectId: string
  backUrl: string
  events: IntegritySuspensionOfVisitsViewEvent[]
}

const parseEvents = (events: IntegritySuspensionOfVisits[]): IntegritySuspensionOfVisitsViewEvent[] =>
  events
    .sort((a, b) => new Date(a.requestedDate || '').getTime() - new Date(b.requestedDate || '').getTime())
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
  legacySubjectId: string,
  backUrl: string,
  events: IntegritySuspensionOfVisits[],
): IntegritySuspensionOfVisitsView => {
  return {
    legacySubjectId,
    backUrl,
    events: parseEvents(events),
  }
}

export const IntegritySuspensionOfVisitsView = {
  construct(
    legacySubjectId: string,
    backUrl: string,
    events: IntegritySuspensionOfVisits[] = [],
  ): IntegritySuspensionOfVisitsView {
    return createViewModelFromApiDto(legacySubjectId, backUrl, events)
  },
}
