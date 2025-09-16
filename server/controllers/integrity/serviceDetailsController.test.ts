import { Request, Response } from 'express'
import { AuditService, IntegrityServiceDetailsService } from '../../services'
import IntegrityServiceDetailsController from './serviceDetailsController'
// eslint-disable-next-line import/no-named-as-default
import { IntegrityServiceDetailsView } from '../../models/view-models/integrityServiceDetails'
import { IntegrityTimelineEvent } from '../../models/view-models/integrityTimelineEvent'
import { createMockRequest, createMockResponse } from '../../testutils/mocks/mockExpress'
import { IntegrityServiceDetails } from '../../data/models/integrityServiceDetails'

jest.mock('../../services/auditService')
jest.mock('../../services/integrity/serviceDetailsService')

const auditService = { logPageView: jest.fn() } as unknown as AuditService
const integrityServiceDetailsService = { getServiceDetails: jest.fn() } as unknown as IntegrityServiceDetailsService

jest.spyOn(IntegrityServiceDetailsView, 'construct')

describe('IntegrityServiceDetailsController', () => {
  let integrityServiceDetailsController: IntegrityServiceDetailsController
  let req: Request
  let res: Response
  const next = jest.fn()

  const testOrderId = '123456789'

  beforeEach(() => {
    integrityServiceDetailsController = new IntegrityServiceDetailsController(
      auditService,
      integrityServiceDetailsService,
    )

    req = createMockRequest({
      params: { legacySubjectId: `${testOrderId}` },
    })

    res = createMockResponse()
  })

  it('should render page with no data', async () => {
    const expectedViewModel = {
      legacySubjectId: testOrderId,
      backUrl: `/integrity/${testOrderId}`,
      serviceDetails: [] as IntegrityServiceDetails[],
    }

    integrityServiceDetailsService.getServiceDetails = jest.fn().mockResolvedValue([])

    await integrityServiceDetailsController.showServiceDetails(req, res, next)

    expect(IntegrityServiceDetailsView.construct).toHaveBeenCalledWith(testOrderId, `/integrity/${testOrderId}`, [])
    expect(IntegrityServiceDetailsView.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/service-details', expectedViewModel)
  })

  it('should render page with visit details', async () => {
    const eventDateTime = '2022-02-02T02:02:02'

    const serviceDetails = {
      legacySubjectId: testOrderId,
      serviceId: 321,
      serviceAddress1: 'address line 1',
      serviceAddress2: 'address line 2',
      serviceAddress3: 'address line 3',
      serviceAddressPostCode: 'postCode',
      serviceStartDate: eventDateTime,
      serviceEndDate: eventDateTime,
      curfewStartDate: eventDateTime,
      curfewEndDate: eventDateTime,
      monday: 1,
      tuesday: 1,
      wednesday: 1,
      thursday: 1,
      friday: 1,
      saturday: 1,
      sunday: 1,
    }

    const expectedViewModel = {
      backUrl: `/integrity/${testOrderId}`,
      serviceDetails: [
        {
          isoDateTime: eventDateTime,
          dateTime: new Date(eventDateTime),
          date: new Date(eventDateTime).toDateString(),
          eventType: 'service-details',
          properties: serviceDetails,
        } as IntegrityTimelineEvent,
      ],
      legacySubjectId: testOrderId,
    }

    integrityServiceDetailsService.getServiceDetails = jest.fn().mockResolvedValue([serviceDetails])

    await integrityServiceDetailsController.showServiceDetails(req, res, next)

    expect(IntegrityServiceDetailsView.construct).toHaveReturnedWith(expectedViewModel)
    expect(res.render).toHaveBeenCalledWith('pages/integrity/service-details', expectedViewModel)
  })
})
