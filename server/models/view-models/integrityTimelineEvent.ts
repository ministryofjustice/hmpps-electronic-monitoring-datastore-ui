import { IntegrityContactEventDetails } from '../../data/models/integrityContactEvent'
import { IntegrityIncidentEventDetails } from '../../data/models/integrityIncidentEvent'
import { IntegrityMonitoringEventDetails } from '../../data/models/integrityMonitoringEvent'
import { IntegrityViolationEventDetails } from '../../data/models/integrityViolationEvent'

export type IntegrityTimelineEvent = {
  dateTime: Date
  date: string
  eventType: string
  properties:
    | IntegrityContactEventDetails
    | IntegrityIncidentEventDetails
    | IntegrityMonitoringEventDetails
    | IntegrityViolationEventDetails
}
