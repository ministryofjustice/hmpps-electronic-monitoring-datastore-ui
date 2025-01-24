import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import OrderService from '../services/orderService'
import EventsService from '../services/eventsService'
import { basicGetTest, GetRequestFixture } from './index.test'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../services/eventsService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const orderService = new OrderService() as jest.Mocked<OrderService>
const eventsService = new EventsService(null, null) as jest.Mocked<EventsService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      orderService,
      eventsService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Order details basic GET requests', () => {
  const orderId = 3

  xit.each<GetRequestFixture>([
    ['order information page', `/orders/${orderId}/information`, 'Order information', Page.ORDER_INFORMATION_PAGE],
    ['order details page', `/orders/${orderId}/details`, 'Order details', Page.ORDER_DETAILS_PAGE],
    ['visits and tasks page', `/orders/${orderId}/visit-details`, 'Visit details', Page.VISIT_DETAILS_PAGE],
    // ['event history page', `/orders/${orderId}/event-history`, 'All event history', Page.EVENT_HISTORY_PAGE],
    [
      'equipment details page',
      `/orders/${orderId}/equipment-details`,
      'Equipment details',
      Page.EQUIPMENT_DETAILS_PAGE,
    ],
    // TODO: services is missing
    ['curfew violations page', `/orders/${orderId}/curfew-violations`, 'Violations', Page.CURFEW_VIOLATIONS_PAGE],
    ['contact history page', `/orders/${orderId}/contact-history`, 'Contact history', Page.CONTACT_HISTORY_PAGE],
    [
      'suspensions page',
      `/orders/${orderId}/suspension-of-visits`,
      'Suspension of visits',
      Page.SUSPENSION_OF_VISITS_PAGE,
    ],
    // TODO: curfew hours not on figma, remove here?
    ['curfew hours page', `/orders/${orderId}/curfew-hours`, 'Curfew hours', Page.CURFEW_HOURS_PAGE],
    // TODO: alerts is missing
    // TODO: 'all event history' is missing
  ])('should render %s', (pageName, route, titleText, auditType) => basicGetTest(pageName, route, titleText, auditType))
})

describe('Order information page', () => {
  it('should call the getOrderInformation to return data', () => {
    const orderId = 'testOrderId'

    return request(app)
      .get(`/orders/${orderId}/information`)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(orderService.getOrderInformation).toHaveBeenCalledTimes(1)
      })
  })
})
