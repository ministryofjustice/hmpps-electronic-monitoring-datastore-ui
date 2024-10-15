import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import OrderService from '../services/orderService'
import { basicGetTest, GetRequestFixture } from './index.test'

jest.mock('../services/auditService')
jest.mock('../services/orderService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const orderService = new OrderService() as jest.Mocked<OrderService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      orderService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Order details basic GET requests', () => {
  it.each<GetRequestFixture>([
    ['order summary page', '/orders/summary', 'Key order details', Page.ORDER_SUMMARY_PAGE],
    ['order details page', '/orders/details', 'Order details', Page.ORDER_DETAILS_PAGE],
    ['visits and tasks page', '/orders/visits-and-tasks', 'Visits and tasks', Page.VISITS_AND_TASKS_PAGE],
    ['event history page', '/orders/event-history', 'Event history', Page.EVENT_HISTORY_PAGE],
    ['equipment details page', '/orders/equipment-details', 'Equipment details', Page.EQUIPMENT_DETAILS_PAGE],
    // TODO: services is missing
    ['curfew violations page', '/orders/curfew-violations', 'Violations', Page.CURFEW_VIOLATIONS_PAGE],
    ['contact history page', '/orders/contact-history', 'Contact history', Page.CONTACT_HISTORY_PAGE],
    ['suspensions page', '/orders/suspensions', 'Suspension of visits', Page.SUSPENSIONS_PAGE],
    // TODO: curfew hours not on figma, remove here?
    ['curfew hours page', '/orders/curfew-hours', 'Curfew hours', Page.CURFEW_HOURS_PAGE],
    // TODO: alerts is missing
    // TODO: 'all event history' is missing
  ])('should render %s', (pageName, route, titleText, auditType) => basicGetTest(pageName, route, titleText, auditType))
})

describe('Order summary page', () => {
  it('should call the getOrderSummary to return data', () => {
    return request(app)
      .get('/orders/summary')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(orderService.getOrderSummary).toHaveBeenCalledTimes(1)
      })
  })
})
