import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  START_PAGE = 'START_PAGE',
  SEARCH_PAGE = 'SEARCH_PAGE',
  SEARCH_RESULTS_PAGE = 'SEARCH_RESULTS_PAGE',
  ORDER_INFORMATION_PAGE = 'ORDER_INFORMATION_PAGE',
  ORDER_DETAILS_PAGE = 'ORDER_DETAILS_PAGE',
  VISIT_DETAILS_PAGE = 'VISIT_DETAILS_PAGE',
  EQUIPMENT_DETAILS_PAGE = 'EQUIPMENT_DETAILS_PAGE',
  CURFEW_TIMETABLE_PAGE = 'CURFEW_TIMETABLE_PAGE',
  EVENT_HISTORY_PAGE = 'EVENT_HISTORY_PAGE',
  SUSPENSION_OF_VISITS_PAGE = 'SUSPENSION_OF_VISITS_PAGE',
  CURFEW_VIOLATIONS_PAGE = 'CURFEW_VIOLATIONS_PAGE',
  CONTACT_HISTORY_PAGE = 'CONTACT_HISTORY_PAGE',
  TEST_CONNECTION_PAGE = 'TEST_CONNECTION_PAGE',
}

export interface PageViewEventDetails {
  who: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: object
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  async logAuditEvent(event: AuditEvent) {
    await this.hmppsAuditClient.sendMessage(event)
  }

  async logPageView(page: Page, eventDetails: PageViewEventDetails) {
    const event: AuditEvent = {
      ...eventDetails,
      what: `PAGE_VIEW_${page}`,
    }
    await this.hmppsAuditClient.sendMessage(event)
  }
}
