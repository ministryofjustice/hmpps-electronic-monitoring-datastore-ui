import Page from '../pages/page'
import { NotFoundErrorPage } from '../pages/error'

context('Not found', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })
    cy.signIn()
  })

  it('is reachable', () => {
    cy.visit(`/orders/${orderId}/invalidaddress`, { failOnStatusCode: false })
    Page.verifyOnPage(NotFoundErrorPage)
  })

  it('Should render the correct elements ', () => {
    cy.visit(`/orders/${orderId}/invalidaddress`, { failOnStatusCode: false })
    const page = Page.verifyOnPage(NotFoundErrorPage)

    page.header.userName.should('contain.text', 'M. Tester')
    page.header.phaseBanner.should('contain.text', 'dev')

    page.checkIsAccessible()
  })
})
