import SuspensionOfVisitsPage from '../../pages/order/suspensionOfVisits'
import Page from '../../pages/page'

context('Suspensions', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
  })

  it('is reachable', () => {
    cy.task('stubDatastoreGetSuspensionOfVisits', {
      httpStatus: 200,
      orderId,
      body: [],
    })

    cy.visit(`/orders/${orderId}/suspension-of-visits`)
    Page.verifyOnPage(SuspensionOfVisitsPage)
  })

  describe('timeline component', () => {
    it('Renders a suspensions timeline', () => {
      cy.task('stubDatastoreGetSuspensionOfVisits', {
        httpStatus: 200,
        orderId,
        body: [
          {
            legacySubjectId: 123,
            legacyOrderId: 321,
            suspensionOfVisits: 'Yes',
            suspensionOfVisitsRequestedDate: '2002-02-02T01:01:01',
            suspensionOfVisitsStartDate: '2002-02-02T01:01:01',
            suspensionOfVisitsEndDate: '2002-02-02T01:01:01',
          },
        ],
      })

      cy.visit(`/orders/${orderId}/suspension-of-visits`)
      const suspensions = Page.verifyOnPage(SuspensionOfVisitsPage)

      suspensions.timeline.should('be.visible')
    })
  })

  describe('Suspensions timeline item', () => {
    it('Includes expected column headers', () => {
      cy.task('stubDatastoreGetSuspensionOfVisits', {
        httpStatus: 200,
        orderId,
        body: [
          {
            legacySubjectId: 123,
            legacyOrderId: 321,
            suspensionOfVisits: 'Yes',
            suspensionOfVisitsRequestedDate: '2002-02-02T01:01:01',
            suspensionOfVisitsStartDate: '2002-02-02T01:01:01',
            suspensionOfVisitsEndDate: '2002-02-02T01:01:01',
          },
          {
            legacySubjectId: 123,
            legacyOrderId: 321,
            suspensionOfVisits: 'No',
            suspensionOfVisitsRequestedDate: '2002-02-02T01:01:01',
            suspensionOfVisitsStartDate: '2002-02-02T01:01:01',
            suspensionOfVisitsEndDate: '2002-02-02T01:01:01',
          },
        ],
      })

      cy.visit(`/orders/${orderId}/suspension-of-visits`)
      const suspensions = Page.verifyOnPage(SuspensionOfVisitsPage)

      suspensions.getTimelineItem(0).within($item => {
        cy.wrap($item).contains('Suspension of visits Yes')
        cy.wrap($item).contains('Requested date 2 February 2002 at 1:01am')
        cy.wrap($item).contains('Start date 2 February 2002 at 1:01am')
        cy.wrap($item).contains('End date 2 February 2002 at 1:01am')
      })

      suspensions.getTimelineItem(1).within($item => {
        cy.wrap($item).contains('Suspension of visits No')
      })
    })
  })
})
