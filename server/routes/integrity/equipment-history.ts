import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'

import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'
import { buildUrl } from '../../utils/utils'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import { IntegrityEquipmentDetail, IntegrityEquipmentDetails } from '../../data/models/integrityEquipmentDetails'
import { TimelineCard, TimelineCardProperty, TimelineItem } from '../../models/view-models/timelineItems'

const mojFilters = allMojFilters()

const fromEquipmentDetail = (deviceDetails: IntegrityEquipmentDetail): TimelineCardProperty[] => {
  const { installedDateTime, removedDateTime } = deviceDetails
  return [
    { label: 'Device ID', value: deviceDetails.id || '' },
    { label: 'Equipment category description', value: deviceDetails.equipmentCategoryDescription || '' },
    { label: 'Install date', value: installedDateTime ? mojFilters.mojDate(installedDateTime, 'date') : '' },
    { label: 'Install time', value: installedDateTime ? mojFilters.mojDate(installedDateTime, 'time') : '' },
    { label: 'Uninstall date', value: removedDateTime ? mojFilters.mojDate(removedDateTime, 'date') : '' },
    { label: 'Uninstall time', value: removedDateTime ? mojFilters.mojDate(removedDateTime, 'time') : '' },
  ]
}

const fromEquipmentHistory = (equipmentDetails: IntegrityEquipmentDetails[]): TimelineItem[] => {
  return (equipmentDetails || []).map(event => {
    const cards: TimelineCard[] = []

    if (event.pid) {
      const card: TimelineCard = { title: 'PID', properties: fromEquipmentDetail(event.pid) }
      cards.push(card)
    }

    if (event.hmu) {
      const card: TimelineCard = { title: 'HMU', properties: fromEquipmentDetail(event.hmu) }
      cards.push(card)
    }

    return {
      label: 'Equipment',
      dateTime: (event.pid || event.hmu)?.installedDateTime,
      cards,
    } as TimelineItem
  })
}

export default function integrityEquipmentHistoryRouter(services: Services): Router {
  const router = Router()

  router.get(
    paths.INTEGRITY.EQUIPMENT_HISTORY,
    auditPageViewRequest({ services, page: Page.INTEGRITY_EQUIPMENT_HISTORY }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      const equipmentDetails = await services.integrityEquipmentDetailsService.getEquipmentDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
        restricted,
      })

      const backUrl = buildUrl(paths.INTEGRITY.SUMMARY, { legacySubjectId })
      const timeline = fromEquipmentHistory(equipmentDetails)

      res.render('pages/integrity/equipment-history', {
        legacySubjectId,
        timeline: timeline.sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
        backUrl,
      })
    },
  )

  return router
}
