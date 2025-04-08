import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  START_PAGE = 'START_PAGE',
  SEARCH_PAGE = 'SEARCH_PAGE',
  SEARCH_RESULTS_PAGE = 'SEARCH_RESULTS_PAGE',
  TEST_CONNECTION_PAGE = 'TEST_CONNECTION_PAGE',

  INTEGRITY_ORDER_SUMMARY_PAGE = 'INTEGRITY_ORDER_SUMMARY_PAGE',
  INTEGRITY_ORDER_DETAILS_PAGE = 'INTEGRITY_ORDER_DETAILS_PAGE',
  INTEGRITY_VISIT_DETAILS_PAGE = 'INTEGRITY_VISIT_DETAILS_PAGE',
  INTEGRITY_EQUIPMENT_DETAILS_PAGE = 'INTEGRITY_EQUIPMENT_DETAILS_PAGE',
  INTEGRITY_SERVICE_DETAILS_PAGE = 'INTEGRITY_SERVICE_DETAILS_PAGE',
  INTEGRITY_EVENT_HISTORY_PAGE = 'INTEGRITY_EVENT_HISTORY_PAGE',
  INTEGRITY_SUSPENSION_OF_VISITS_PAGE = 'INTEGRITY_SUSPENSION_OF_VISITS_PAGE',

  AM_ORDER_SUMMARY_PAGE = 'ALCOHOL_MONITORING_INTEGIRTY_ORDER_SUMMARY_PAGE',
  AM_ORDER_DETAILS_PAGE = 'ALCOHOL_MONITORING_ORDER_DETAILS_PAGE',
  AM_VISIT_DETAILS_PAGE = 'ALCOHOL_MONITORING_VISIT_DETAILS_PAGE',
  AM_EQUIPMENT_DETAILS_PAGE = 'ALCOHOL_MONITORING_EQUIPMENT_DETAILS_PAGE',
  AM_SERVICE_DETAILS_PAGE = 'ALCOHOL_MONITORING_SERVICE_DETAILS_PAGE',
  AM_EVENT_HISTORY_PAGE = 'ALCOHOL_MONITORING_EVENT_HISTORY_PAGE',
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
