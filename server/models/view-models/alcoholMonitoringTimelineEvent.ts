import { AlcoholMonitoringContactEventDetails } from '../../data/models/alcoholMonitoringContactEvent'
import { AlcoholMonitoringIncidentEventDetails } from '../../data/models/alcoholMonitoringIncidentEvent'
import { AlcoholMonitoringViolationEventDetails } from '../../data/models/alcoholMonitoringViolationEvent'

export type AlcoholMonitoringTimelineEvent = {
  dateTime: Date
  date: string
  eventType: string
  properties:
    | AlcoholMonitoringContactEventDetails
    | AlcoholMonitoringIncidentEventDetails
    | AlcoholMonitoringViolationEventDetails
}
