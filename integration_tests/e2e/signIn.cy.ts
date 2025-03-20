import Page from '../pages/page'
import AuthSignInPage from '../pages/auth/signIn'
import AuthManageDetailsPage from '../pages/auth/manageDetails'
import StartPage from '../pages/start'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Unauthenticated user navigating to sign in page directed to auth', () => {
    cy.visit('/sign-in')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User name visible in header', () => {
    cy.signIn()
    const startPage = Page.verifyOnPage(StartPage)
    startPage.header.userName.contains('J. Smith')
  })

  it('Phase banner visible in header', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(StartPage)
    indexPage.header.phaseBanner.contains('dev')
  })

  it('User can sign out', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(StartPage)
    indexPage.header.signOut.click()
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User can manage their details', () => {
    cy.signIn()
    cy.task('stubAuthManageDetails')
    const indexPage = Page.verifyOnPage(StartPage)

    indexPage.header.manageDetails.get('a').invoke('removeAttr', 'target')
    indexPage.header.manageDetails.click()
    Page.verifyOnPage(AuthManageDetailsPage)
  })

  it('Token verification failure takes user to sign in page', () => {
    cy.signIn()
    Page.verifyOnPage(StartPage)
    cy.task('stubVerifyToken', false)

    // can't do a visit here as cypress requires only one domain
    cy.request('/').its('body').should('contain', 'Sign in')
  })

  it('Token verification failure clears user session', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(StartPage)
    cy.task('stubVerifyToken', false)

    // can't do a visit here as cypress requires only one domain
    cy.request('/').its('body').should('contain', 'Sign in')

    cy.task('stubVerifyToken', true)
    cy.task('stubSignIn', { name: 'bobby brown', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.signIn()

    indexPage.header.userName.contains('B. Brown')
  })
})
