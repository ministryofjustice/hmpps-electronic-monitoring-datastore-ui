import Page from '../pages/page'
import { NotFoundErrorPage } from '../pages/error'

context('Not found', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })
    cy.signIn()
  })

  it('Should display the user name visible in header', () => {
    cy.visit(`/integrity/${orderId}/invalidaddress`, { failOnStatusCode: false })
    const page = Page.verifyOnPage(NotFoundErrorPage)
    page.header.userName.should('contain.text', 'M. Tester')
  })

  it('Should display the phase banner in header', () => {
    cy.visit(`/integrity/${orderId}/invalidaddress`, { failOnStatusCode: false })
    const page = Page.verifyOnPage(NotFoundErrorPage)
    page.header.phaseBanner.should('contain.text', 'DEV')
  })

  it('Should display the back link', () => {
    cy.visit(`/integrity/${orderId}/invalidaddress`, { failOnStatusCode: false })
    const page = Page.verifyOnPage(NotFoundErrorPage)

    page.backButton.should('exist')
  })

  it('Should be accessible', () => {
    cy.visit(`/integrity/${orderId}/invalidaddress`, { failOnStatusCode: false })
    const page = Page.verifyOnPage(NotFoundErrorPage)
    page.checkIsAccessible()
  })
})
