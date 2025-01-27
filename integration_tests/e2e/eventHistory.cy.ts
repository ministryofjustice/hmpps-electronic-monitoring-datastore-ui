import EventHistoryPage from '../pages/eventHistory'
import Page from '../pages/page'

context('Event history', () => {
  const orderId = 1234567

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')

    cy.task('stubDatastoreGetMonitoringEvents', {
      httpStatus: 200,
      orderId,
      events: [
        {
          legacyOrderId: orderId,
          legacySubjectId: orderId,
          type: 'TEST_EVENT',
          dateTime: '2022-02-02T01:02:03',
          details: {
            processedDateTime: '2022-02-02T01:02:06',
          },
        },
      ],
    })
    cy.task('stubDatastoreGetIncidentEvents', {
      httpStatus: 200,
      orderId,
      events: [
        {
          legacyOrderId: orderId,
          legacySubjectId: orderId,
          type: 'TEST_INCIDENT',
          dateTime: '2022-02-02T01:02:06',
          details: {
            violation: 'A_VIOLATION',
          },
        },
      ],
    })
    cy.task('stubDatastoreGetContactEvents', {
      httpStatus: 200,
      orderId,
      events: [
        {
          legacyOrderId: orderId,
          legacySubjectId: orderId,
          type: 'TEST_CONTACT',
          dateTime: '2022-02-03T01:02:09',
          details: {
            outcome: 'there was an outcome',
            contactType: 'PHONE_CALL',
            reason: 'there was a reason',
            channel: 'TELEPHONE',
            userId: 'Test User A',
            userName: 'UID-123',
            modifiedDateTime: '2022-02-03T01:09:09',
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
      eventHistory.timeline().should('be.visible')
    })
  })

  describe('Event timeline item', () => {
    it('Includes expected monitoring event', () => {
      cy.visit(`/orders/${orderId}/event-history`)

      const eventHistory = Page.verifyOnPage(EventHistoryPage)
      eventHistory
        .events()
        .eq(0)
        .within($item => {
          cy.wrap($item).contains('TEST_EVENT Details')
          cy.wrap($item).contains('processedDateTime') // 2022-02-02T01:02:06')
        })
    })

    it('Includes expected incident event', () => {
      cy.visit(`/orders/${orderId}/event-history`)

      const eventHistory = Page.verifyOnPage(EventHistoryPage)
      eventHistory
        .events()
        .eq(1)
        .within($item => {
          cy.wrap($item).contains('TEST_INCIDENT Details')
          cy.wrap($item).contains('violation A_VIOLATION')
        })
    })

    it('Includes expected contact event', () => {
      cy.visit(`/orders/${orderId}/event-history`)

      const eventHistory = Page.verifyOnPage(EventHistoryPage)
      eventHistory
        .events()
        .eq(2)
        .within($item => {
          cy.wrap($item).contains('TEST_CONTACT Details')
          cy.wrap($item).contains('outcome there was an outcome')
          cy.wrap($item).contains('contactType PHONE_CALL')
          cy.wrap($item).contains('reason there was a reason')
          cy.wrap($item).contains('channel TELEPHONE')
          cy.wrap($item).contains('userId Test User A')
          cy.wrap($item).contains('userName UID-123')
          cy.wrap($item).contains('modifiedDateTime 2022-02-03T01:09:09')
        })
    })
  })
})
