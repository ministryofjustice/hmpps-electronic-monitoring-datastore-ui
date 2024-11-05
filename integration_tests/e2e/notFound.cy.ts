import NotFoundPage from '../pages/notFound'
import Page, { PageElement } from '../pages/page'

context('Not found', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/invalidaddress`, { failOnStatusCode: false })
  })

  it('is reachable', () => {
    Page.verifyOnPage(NotFoundPage)
  })
})
