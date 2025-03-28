import type { Express } from 'express'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import EmDatastoreEventsService from '../services/emDatastoreEventsService'
import { basicGetTest, GetRequestFixture } from './index.test'

jest.mock('../services/auditService')
jest.mock('../services/emDatastoreEventsService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const eventsService = new EmDatastoreEventsService(null, null) as jest.Mocked<EmDatastoreEventsService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      emDatastoreEventsService: eventsService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

// TODO: These are essentially integration tests - they will all be removed
describe('Order details basic GET requests', () => {
  const orderId = 3

  xit.each<GetRequestFixture>([
    ['order information page', `/orders/${orderId}/summary`, 'Order information', Page.ORDER_INFORMATION_PAGE],
    ['order details page', `/orders/${orderId}/details`, 'Order details', Page.ORDER_DETAILS_PAGE],
    ['visits and tasks page', `/orders/${orderId}/visit-details`, 'Visit details', Page.VISIT_DETAILS_PAGE],
    ['event history page', `/orders/${orderId}/event-history`, 'All event history', Page.EVENT_HISTORY_PAGE],
    [
      'equipment details page',
      `/orders/${orderId}/equipment-details`,
      'Equipment details',
      Page.EQUIPMENT_DETAILS_PAGE,
    ],
    [
      'suspensions page',
      `/orders/${orderId}/suspension-of-visits`,
      'Suspension of visits',
      Page.SUSPENSION_OF_VISITS_PAGE,
    ],
    ['curfew timetable page', `/orders/${orderId}/curfew-timetable`, 'Curfew hours', Page.CURFEW_TIMETABLE_PAGE],
  ])('should render %s', (pageName, route, titleText, auditType) => basicGetTest(pageName, route, titleText, auditType))
})
