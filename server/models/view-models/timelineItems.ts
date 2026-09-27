import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'

import { IntegrityVisitDetails } from '../../data/models/integrityVisitDetails'
import { IntegrityEquipmentDetail, IntegrityEquipmentDetails } from '../../data/models/integrityEquipmentDetails'
import { IntegrityServiceDetails } from '../../data/models/integrityServiceDetails'
import { IntegritySuspensionOfVisits } from '../../data/models/integritySuspensionOfVisits'
import { IntegrityContactEvent } from '../../data/models/integrityContactEvent'
import { IntegrityIncidentEvent } from '../../data/models/integrityIncidentEvent'
import { IntegrityMonitoringEvent } from '../../data/models/integrityMonitoringEvent'
import { IntegrityViolationEvent } from '../../data/models/integrityViolationEvent'

const mojFilters = allMojFilters()

export type TimelineCardProperty = {
  label: string
  value: string
}

export type TimelineCard = {
  title: string
  properties: TimelineCardProperty[]
}

export type TimelineItem = {
  label: string
  dateTime: string
  cards: TimelineCard[]
}
