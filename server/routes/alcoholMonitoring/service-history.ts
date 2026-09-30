import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'

import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { buildUrl } from '../../utils/utils'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import { TimelineCard, TimelineItem } from '../../models/view-models/timelineItems'
import { AlcoholMonitoringServiceDetails } from '../../data/models/alcoholMonitoringServiceDetails'

const mojFilters = allMojFilters()

export default function alcoholMonitoringServiceHistoryRouter(services: Services): Router {
  const router = Router()

  const toServiceSummary = (event: AlcoholMonitoringServiceDetails): TimelineCard => {
    const { serviceStartDate, serviceEndDate } = event

    return {
      title: 'Service',
      properties: [
        { label: 'Start date', value: serviceStartDate ? mojFilters.mojDate(serviceStartDate, 'date') : '' },
        { label: 'End date', value: serviceEndDate ? mojFilters.mojDate(serviceEndDate, 'date') : '' },
        { label: 'Address', value: event.serviceAddress || '' },
      ],
    }
  }

  const toEquipmentSummary = (event: AlcoholMonitoringServiceDetails): TimelineCard => {
    const { equipmentStartDate, equipmentEndDate } = event

    return {
      title: 'Equipment',
      properties: [
        { label: 'Start date', value: equipmentStartDate ? mojFilters.mojDate(equipmentStartDate, 'date') : '' },
        { label: 'End date', value: equipmentEndDate ? mojFilters.mojDate(equipmentEndDate, 'date') : '' },
        { label: 'HMU Serial Number', value: event.hmuSerialNumber || '' },
        { label: 'Device Serial Number', value: event.deviceSerialNumber || '' },
      ],
    }
  }

  const fromServiceDetails = (serviceDetails: AlcoholMonitoringServiceDetails[]): TimelineItem[] => {
    return (serviceDetails || []).map(event => {
      return {
        label: 'Service',
        dateTime: event.serviceStartDate,
        cards: [toServiceSummary(event), toEquipmentSummary(event)],
      } as TimelineItem
    })
  }

  router.get(
    paths.ALCOHOL_MONITORING.SERVICE_HISTORY,
    auditPageViewRequest({ services, page: Page.ALCOHOL_MONITORING_SERVICE_HISTORY }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }

      const serviceDetails = await services.alcoholMonitoringServiceDetailsService.getServiceDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
      })

      const backUrl = buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId })
      const timeline = fromServiceDetails(serviceDetails)

      res.render('pages/alcohol-monitoring/service-history', {
        legacySubjectId,
        timeline: timeline.sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
        backUrl,
      })
    },
  )

  return router
}
