import EventHistoryPage from '../../pages/order/eventHistory'
import Page from '../../pages/page'

context('Event history', () => {
  const orderId = 1234567

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')

    cy.task('stubDatastoreGetMonitoringEvents', {
      httpStatus: 200,
      orderId,
      body: [
        {
          legacyOrderId: orderId,
          legacySubjectId: orderId,
          type: 'monitoring',
          dateTime: '2022-02-02T01:03:03',
          details: {
            processedDateTime: '2022-02-02T01:03:03',
          },
        },
      ],
    })
    cy.task('stubDatastoreGetIncidentEvents', {
      httpStatus: 200,
      orderId,
      body: [
        {
          legacyOrderId: orderId,
          legacySubjectId: orderId,
          type: 'incident',
          dateTime: '2022-02-02T01:06:06',
          details: {
            type: 'an incident occurred',
          },
        },
      ],
    })
    cy.task('stubDatastoreGetContactEvents', {
      httpStatus: 200,
      orderId,
      body: [
        {
          legacyOrderId: orderId,
          legacySubjectId: orderId,
          type: 'contact',
          dateTime: '2022-02-03T01:09:09',
          details: {
            outcome: 'there was an outcome',
            type: 'PHONE_CALL',
            reason: 'there was a reason',
            channel: 'TELEPHONE',
            userId: 'Test User A',
            userName: 'UID-123',
            modifiedDateTime: '2022-02-03T01:09:09',
          },
        },
      ],
    })
    cy.task('stubDatastoreGetViolationEvents', {
      httpStatus: 200,
      orderId,
      body: [
        {
          legacyOrderId: orderId,
          legacySubjectId: orderId,
          type: 'violation',
          dateTime: '2022-02-03T01:12:12',
          details: {
            breachDetails: 'details of breach',
            breachEnforcementOutcome: 'outcome of breach',
            breachDateTime: '2022-02-03T01:12:12',
            breachIdentifiedDateTime: '2022-02-03T01:12:12',
            breachPackRequestedDate: '2022-02-03T01:12:12',
            breachPackSentDate: '2022-02-03T01:12:12',

            authorityFirstNotifiedDateTime: '2022-02-03T01:12:12',

            agencyAction: 'action of agency',
            agencyActionDate: '2022-02-03T01:12:12',

            investigationOutcomeReason: 'invest outcome',
            enforcementReason: 'enforce reason',

            warningLetterSentDateTime: '2022-02-03T01:12:12',
            subjectLetterSentDate: '2022-02-03T01:12:12',
            summonsServedDate: '2022-02-03T01:12:12',
            hearingDate: '2022-02-03T01:12:12',
            section9Date: '2022-02-03T01:12:12',
          },
        },
      ],
    })

    cy.signIn()
  })

  it('is reachable', () => {
    cy.visit(`/orders/${orderId}/event-history`)
    Page.verifyOnPage(EventHistoryPage)
  })

  describe('Event timeline component', () => {
    it('Renders an event timeline', () => {
      cy.visit(`/orders/${orderId}/event-history`)

      const eventHistory = Page.verifyOnPage(EventHistoryPage)
      eventHistory.timeline.should('be.visible')
    })
  })

  describe('Event timeline item', () => {
    it('Includes expected monitoring event', () => {
      cy.visit(`/orders/${orderId}/event-history`)

      const eventHistory = Page.verifyOnPage(EventHistoryPage)
      eventHistory.getTimelineItem(0).within($item => {
        cy.wrap($item).contains('Monitoring event 2 Feb 2022 at 1:03am')
        cy.wrap($item).contains('Processed at 2 February 2022 at 1:03am')
      })
    })

    it('Includes expected incident event', () => {
      cy.visit(`/orders/${orderId}/event-history`)

      const eventHistory = Page.verifyOnPage(EventHistoryPage)
      eventHistory.getTimelineItem(1).within($item => {
        cy.wrap($item).contains('Incident event 2 Feb 2022 at 1:06am')
        cy.wrap($item).contains('Type an incident occurred')
      })
    })

    it('Includes expected contact event', () => {
      cy.visit(`/orders/${orderId}/event-history`)

      const eventHistory = Page.verifyOnPage(EventHistoryPage)
      eventHistory.getTimelineItem(2).within($item => {
        cy.wrap($item).contains('Contact event 3 Feb 2022 at 1:09am')

        cy.wrap($item).contains('Outcome there was an outcome')
        cy.wrap($item).contains('Type PHONE_CALL')
        cy.wrap($item).contains('Reason there was a reason')
        cy.wrap($item).contains('Channel TELEPHONE')
        cy.wrap($item).contains('User UID-123')
        cy.wrap($item).contains('Modified on 3 February 2022 at 1:09am')
      })
    })

    it('Includes expected violation event', () => {
      cy.visit(`/orders/${orderId}/event-history`)

      const eventHistory = Page.verifyOnPage(EventHistoryPage)
      eventHistory.getTimelineItem(3).within($item => {
        cy.wrap($item).contains('Violation event 3 Feb 2022 at 1:12am')

        cy.wrap($item).contains('Breach details details of breach')
        cy.wrap($item).contains('Breach enforcement outcome outcome of breach')
        cy.wrap($item).contains('Breach at 3 February 2022 at 1:12am')
        cy.wrap($item).contains('Breach identified at 3 February 2022 at 1:12am')
        cy.wrap($item).contains('Breach pack requested on 3 February 2022')
        cy.wrap($item).contains('Breach pack sent on 3 February 2022')
        cy.wrap($item).contains('Authority first notified at 3 February 2022 at 1:12am')
        cy.wrap($item).contains('Agency action action of agency')
        cy.wrap($item).contains('Agency action on 3 February 2022')
        cy.wrap($item).contains('Investigation outcome reason invest outcome')
        cy.wrap($item).contains('Enforcement reason enforce reason')
        cy.wrap($item).contains('Warning letter sent at 3 February 2022 at 1:12am')
        cy.wrap($item).contains('Subject letter sent on 3 February 2022')
        cy.wrap($item).contains('Summons server on 3 February 2022')
        cy.wrap($item).contains('Hearing date 3 February 2022')
        cy.wrap($item).contains('Section 9 date 3 February 2022')
      })
    })
  })
})
