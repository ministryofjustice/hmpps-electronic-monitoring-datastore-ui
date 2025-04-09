import { IntegrityContactEventDetails } from './contactEvents'
import { IntegrityIncidentEventDetails } from './incidentEvents'
import { IntegrityMonitoringEventDetails } from './monitoringEvents'
import { IntegrityViolationEventDetails } from './violationEvents'

export type IntegrityTimelineEventModel = {
  dateTime: Date
  date: string
  eventType: string
  properties:
    | IntegrityContactEventDetails
    | IntegrityIncidentEventDetails
    | IntegrityMonitoringEventDetails
    | IntegrityViolationEventDetails
}
