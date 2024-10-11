import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'

jest.mock('../services/auditService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

type GetRequestFixture = [pageName: string, route: string, titleText: string, auditType: Page]

describe('Core page basic GET requests', () => {
  it.each<GetRequestFixture>([
    ['index page', '/', 'Electronic Monitoring Datastore', Page.START_PAGE],
    ['search page', '/search', 'Search for case details', Page.SEARCH_PAGE],
    ['order summary page', '/order-summary', 'Key order details', Page.ORDER_SUMMARY_PAGE],
  ])('should render %s', (pageName, route, titleText, auditType) => basicGetTest(pageName, route, titleText, auditType))
})

describe('Order details basic GET requests', () => {
  it.each<GetRequestFixture>([
    ['order details page', '/order-details', 'Order details', Page.ORDER_DETAILS_PAGE],
    ['visits and tasks page', '/visits-and-tasks', 'Visits and tasks', Page.VISITS_AND_TASKS_PAGE],
    ['event history page', '/event-history', 'Event history', Page.EVENT_HISTORY_PAGE],
    ['equipment details page', '/equipment-details', 'Equipment details', Page.EQUIPMENT_DETAILS_PAGE],
    // TODO: services is missing
    ['curfew violations page', '/curfew-violations', 'Violations', Page.CURFEW_VIOLATIONS_PAGE],
    ['contact history page', '/contact-history', 'Contact history', Page.CONTACT_HISTORY_PAGE],
    ['suspensions page', '/suspensions', 'Suspension of visits', Page.SUSPENSIONS_PAGE],
    // TODO: curfew hours not on figma, remove here?
    ['curfew hours page', '/curfew-hours', 'Curfew hours', Page.CURFEW_HOURS_PAGE],
    // TODO: alerts is missing
    // TODO: 'all event history' is missing
  ])('should render %s', (pageName, route, titleText, auditType) => basicGetTest(pageName, route, titleText, auditType))
})

function basicGetTest(pageName: string, route: string, titleText: string, auditType: Page) {
  auditService.logPageView.mockResolvedValue(null)

  return request(app)
    .get(route)
    .expect('Content-Type', /html/)
    .expect(res => {
      expect(res.text).toContain(titleText)
      expect(auditService.logPageView).toHaveBeenCalledWith(auditType, {
        who: user.username,
        correlationId: expect.any(String),
      })
    })
}
