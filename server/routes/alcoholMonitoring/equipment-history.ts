import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'

import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { buildUrl } from '../../utils/utils'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import { TimelineCard, TimelineItem } from '../../models/view-models/timelineItems'
import { AlcoholMonitoringEquipmentDetails } from '../../data/models/alcoholMonitoringEquipmentDetails'

const mojFilters = allMojFilters()

const toEquipmentSummary = (event: AlcoholMonitoringEquipmentDetails): TimelineCard => {
  return {
    title: 'Equipment',
    properties: [
      { label: 'Device type', value: event.deviceType },
      { label: 'Device Serial Number', value: event.deviceSerialNumber },
      { label: 'Device Address Type', value: event.deviceAddressType },
      { label: 'Leg Fitting', value: event.legFitting },

      { label: 'Device installed date', value: mojFilters.mojDate(event.deviceInstalledDateTime, 'date') },
      { label: 'Device installed time', value: mojFilters.mojDate(event.deviceInstalledDateTime, 'time') },
      { label: 'Device removed date', value: mojFilters.mojDate(event.deviceRemovedDateTime, 'date') },
      { label: 'Device removed time', value: mojFilters.mojDate(event.deviceRemovedDateTime, 'time') },

      { label: 'HMU installed date', value: mojFilters.mojDate(event.hmuInstallDateTime, 'date') },
      { label: 'HMU installed time', value: mojFilters.mojDate(event.hmuInstallDateTime, 'time') },
      { label: 'HMU removed date', value: mojFilters.mojDate(event.hmuRemovedDateTime, 'date') },
      { label: 'HMU removed time', value: mojFilters.mojDate(event.hmuRemovedDateTime, 'time') },
    ],
  }
}

const fromEquipmentHistory = (equipmentDetails: AlcoholMonitoringEquipmentDetails[]): TimelineItem[] => {
  return (equipmentDetails || []).map(event => {
    return {
      label: 'Equipment',
      dateTime: event.deviceInstalledDateTime,
      cards: [toEquipmentSummary(event)],
    } as TimelineItem
  })
}

export default function alcoholMonitoringRouter(services: Services): Router {
  const router = Router()

  router.get(
    paths.ALCOHOL_MONITORING.EQUIPMENT_HISTORY,
    auditPageViewRequest({ services, page: Page.ALCOHOL_MONITORING_EQUIPMENT_HISTORY }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }

      const equipmentDetails = await services.alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
      })

      const backUrl = buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId })
      const timeline = fromEquipmentHistory(equipmentDetails)

      res.render('pages/alcohol-monitoring/equipment-history', {
        legacySubjectId,
        timeline: timeline.sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
        backUrl,
      })
    },
  )

  return router
}
