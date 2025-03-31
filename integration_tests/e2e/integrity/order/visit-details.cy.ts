import Page from '../../../pages/page'
import VisitDetailsPage from '../../../pages/order/visitDetails'

context('Visit details', () => {
  const legacySubjectId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })
    cy.signIn()
  })

  it('is reachable', () => {
    cy.task('stubDatastoreGetVisitDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    cy.visit(`/integrity/orders/${legacySubjectId}/visit-details`)
    Page.verifyOnPage(VisitDetailsPage, { legacySubjectId })
  })

  it('Should render the correct elements ', () => {
    cy.task('stubDatastoreGetVisitDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const page = Page.visit(VisitDetailsPage, { legacySubjectId })

    page.header.userName.should('contain.text', 'M. Tester')
    page.header.phaseBanner.should('contain.text', 'dev')

    page.checkIsAccessible()
  })

  describe('timeline component', () => {
    it('Renders a suspensions timeline', () => {
      cy.task('stubDatastoreGetVisitDetails', {
        httpStatus: 200,
        legacySubjectId,
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

      const suspensions = Page.visit(VisitDetailsPage, { legacySubjectId })
      suspensions.timeline.should('be.visible')
    })
  })

  describe('Visit details timeline item', () => {
    it('First table includes expected column headers', () => {
      cy.task('stubDatastoreGetVisitDetails', {
        httpStatus: 200,
        legacySubjectId,
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

      const visitDetails = Page.visit(VisitDetailsPage, { legacySubjectId })
      visitDetails.getTimelineItem(0).within($item => {
        cy.wrap($item).contains('TEST_VISIT_TYPE')
        cy.wrap($item).contains('Address address line 1 address line 2 address line 3 address line 4 postcode')
        cy.wrap($item).contains('Actual work start date 2 February 2002')
        cy.wrap($item).contains('Actual work start time 1:01am')
        cy.wrap($item).contains('Actual work end date 2 February 2002')
        cy.wrap($item).contains('Actual work end time 2:02am')
        cy.wrap($item).contains('Notes TEST_NOTES')
        cy.wrap($item).contains('Outcome TEST_OUTCOME')
      })
    })

    it('Second table includes expected column headers', () => {
      cy.task('stubDatastoreGetVisitDetails', {
        httpStatus: 200,
        legacySubjectId,
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

      const visitDetails = Page.visit(VisitDetailsPage, { legacySubjectId })
      visitDetails.getTimelineItem(1).within($item => {
        cy.wrap($item).contains('TEST_VISIT_TYPE_2')
        cy.wrap($item).contains('Address address line 5 address line 6 address line 7 address line 8 postcode 2')
        cy.wrap($item).contains('Actual work start date 2 February 2002')
        cy.wrap($item).contains('Actual work start time 3:03am')
        cy.wrap($item).contains('Actual work end date 2 February 2002')
        cy.wrap($item).contains('Actual work end time 4:04am')
        cy.wrap($item).contains('Notes TEST_NOTES_2')
        cy.wrap($item).contains('Outcome TEST_OUTCOME_2')
      })
    })
  })
})
