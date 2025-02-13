import VisitDetailsPage from '../../pages/order/visitDetails'
import Page from '../../pages/page'

context('Visit details', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
  })

  it('is reachable', () => {
    cy.task('stubDatastoreGetVisitDetails', {
      httpStatus: 200,
      orderId,
      body: [],
    })

    cy.visit(`/orders/${orderId}/visit-details`)
    Page.verifyOnPage(VisitDetailsPage)
  })

  describe('timeline component', () => {
    it('Renders a suspensions timeline', () => {
      cy.task('stubDatastoreGetVisitDetails', {
        httpStatus: 200,
        orderId,
        body: [
          {
            legacyOrderId: 123,
            legacySubjectId: 321,
            address: {
              addressLine1: 'address line 1',
              addressLine2: 'address line 2',
              addressLine3: 'address line 3',
              addressLine4: 'address line 4',
              postcode: 'postcode',
            },
            actualWorkStartDateTime: '2002-02-02T01:01:01',
            actualWorkEndDateTime: '2002-02-02T02:02:02',
            visitNotes: 'TEST_NOTES',
            visitType: 'TEST_VISIT_TYPE',
            visitOutcome: 'TEST_OUTCOME',
          },
        ],
      })

      cy.visit(`/orders/${orderId}/visit-details`)
      const suspensions = Page.verifyOnPage(VisitDetailsPage)

      suspensions.timeline.should('be.visible')
    })
  })

  describe('Visit details timeline item', () => {
    it('First table includes expected column headers', () => {
      cy.task('stubDatastoreGetVisitDetails', {
        httpStatus: 200,
        orderId,
        body: [
          {
            legacyOrderId: 123,
            legacySubjectId: 321,
            address: {
              addressLine1: 'address line 1',
              addressLine2: 'address line 2',
              addressLine3: 'address line 3',
              addressLine4: 'address line 4',
              postcode: 'postcode',
            },
            actualWorkStartDateTime: '2002-02-02T01:01:01',
            actualWorkEndDateTime: '2002-02-02T02:02:02',
            visitNotes: 'TEST_NOTES',
            visitType: 'TEST_VISIT_TYPE',
            visitOutcome: 'TEST_OUTCOME',
          },
        ],
      })

      cy.visit(`/orders/${orderId}/visit-details`)
      const visitDetails = Page.verifyOnPage(VisitDetailsPage)

      visitDetails.getTimelineItem(0).within($item => {
        cy.wrap($item).contains('Type TEST_VISIT_TYPE')
        cy.wrap($item).contains('Address address line 1 address line 2 address line 3 address line 4 postcode')
        cy.wrap($item).contains('Actual work start date 2 February 2002 at 1:01am')
        cy.wrap($item).contains('Actual work end date 2 February 2002 at 2:02am')
        cy.wrap($item).contains('Notes TEST_NOTES')
        cy.wrap($item).contains('Outcome TEST_OUTCOME')
      })
    })

    it('Second table includes expected column headers', () => {
      cy.task('stubDatastoreGetVisitDetails', {
        httpStatus: 200,
        orderId,
        body: [
          {
            legacyOrderId: 123,
            legacySubjectId: 321,
            address: {
              addressLine1: 'address line 1',
              addressLine2: 'address line 2',
              addressLine3: 'address line 3',
              addressLine4: 'address line 4',
              postcode: 'postcode',
            },
            actualWorkStartDateTime: '2002-02-02T01:01:01',
            actualWorkEndDateTime: '2002-02-02T02:02:02',
            visitNotes: 'TEST_NOTES',
            visitType: 'TEST_VISIT_TYPE',
            visitOutcome: 'TEST_OUTCOME',
          },
          {
            legacyOrderId: 123,
            legacySubjectId: 321,
            address: {
              addressLine1: 'address line 5',
              addressLine2: 'address line 6',
              addressLine3: 'address line 7',
              addressLine4: 'address line 8',
              postcode: 'postcode 2',
            },
            actualWorkStartDateTime: '2002-02-02T03:03:03',
            actualWorkEndDateTime: '2002-02-02T04:04:04',
            visitNotes: 'TEST_NOTES_2',
            visitType: 'TEST_VISIT_TYPE_2',
            visitOutcome: 'TEST_OUTCOME_2',
          },
        ],
      })

      cy.visit(`/orders/${orderId}/visit-details`)
      const visitDetails = Page.verifyOnPage(VisitDetailsPage)

      visitDetails.getTimelineItem(1).within($item => {
        cy.wrap($item).contains('Type TEST_VISIT_TYPE_2')
        cy.wrap($item).contains('Address address line 5 address line 6 address line 7 address line 8 postcode 2')
        cy.wrap($item).contains('Actual work start date 2 February 2002 at 3:03am')
        cy.wrap($item).contains('Actual work end date 2 February 2002 at 4:04am')
        cy.wrap($item).contains('Notes TEST_NOTES_2')
        cy.wrap($item).contains('Outcome TEST_OUTCOME_2')
      })
    })
  })
})
