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
  const { deviceInstalledDateTime, deviceRemovedDateTime, hmuInstallDateTime, hmuRemovedDateTime } = event

  return {
    title: 'Equipment',
    properties: [
      { label: 'Device type', value: event.deviceType || '' },
      { label: 'Device serial number', value: event.deviceSerialNumber || '' },
      { label: 'Device address type', value: event.deviceAddressType || '' },
      { label: 'Leg fitting', value: event.legFitting || '' },
      {
        label: 'Device installed date time',
        value: deviceInstalledDateTime ? mojFilters.mojDate(deviceInstalledDateTime, 'datetime') : '',
      },
      {
        label: 'Device removed date time',
        value: deviceRemovedDateTime ? mojFilters.mojDate(deviceRemovedDateTime, 'datetime') : '',
      },
      {
        label: 'HMU install date time',
        value: hmuInstallDateTime ? mojFilters.mojDate(hmuInstallDateTime, 'datetime') : '',
      },
      {
        label: 'HMU removed date time',
        value: hmuRemovedDateTime ? mojFilters.mojDate(hmuRemovedDateTime, 'datetime') : '',
      },
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
