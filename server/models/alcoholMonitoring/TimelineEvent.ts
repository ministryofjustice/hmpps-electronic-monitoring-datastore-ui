import { AlcoholMonitoringContactEventDetails } from './contactEvents'
import { AlcoholMonitoringIncidentEventDetails } from './incidentEvents'
import { AlcoholMonitoringViolationEventDetails } from './violationEvents'

export type AlcoholMonitoringTimelineEventModel = {
  dateTime: Date
  date: string
  eventType: string
  properties:
    | AlcoholMonitoringContactEventDetails
    | AlcoholMonitoringIncidentEventDetails
    | AlcoholMonitoringViolationEventDetails
}
