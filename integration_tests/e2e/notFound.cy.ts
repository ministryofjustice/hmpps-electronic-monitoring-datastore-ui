import Page from '../pages/page'
import { NotFoundErrorPage } from '../pages/error'

context('Not found', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })
    cy.signIn()
    cy.visit(`/orders/${orderId}/invalidaddress`, { failOnStatusCode: false })
  })

  it('is reachable', () => {
    Page.verifyOnPage(NotFoundErrorPage)
  })
})
