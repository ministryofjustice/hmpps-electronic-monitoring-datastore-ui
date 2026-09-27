import { TimelineItem } from './timelineItems'

export type TimelineView = {
  legacySubjectId: string
  timeline: TimelineItem[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  timeline: TimelineItem[],
): TimelineView => ({
  legacySubjectId,
  timeline: timeline.sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
  backUrl,
})

export const TimelineView = {
  construct(legacySubjectId: string, backUrl: string, timeline: TimelineItem[] = []): TimelineView {
    return createViewModelFromApiDto(legacySubjectId, backUrl, timeline)
  },
}
