import OrderSummaryPage from '../pages/orderSummary'
import Page from '../pages/page'

context('Order Summary', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit('/orders/fake-order-id/summary')
  })

  it('is reachable', () => {
    Page.verifyOnPage(OrderSummaryPage)
  })

  describe('Order summary table', () => {
    it('contains row Legacy subject ID', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.legacySubjectId().should('be.visible')
    })
  })
})
