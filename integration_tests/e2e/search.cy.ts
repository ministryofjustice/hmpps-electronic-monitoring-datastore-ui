import { HMPPS_AUTH_ROLES } from '../../server/constants/roles'
import Page from '../pages/page'
import SearchPage from '../pages/search'
import StartPage from '../pages/start'

const expectedValidationErrors = {
  form: 'You must enter a value into at least one search field',
  firstName: 'First name must contain letters only',
  lastName: 'Last name must contain letters only',
  alias: 'Alias must contain letters and spaces only',
  dob: 'Enter date of birth',
}

context('Search', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: [HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_GENERAL__RO] })

    cy.signIn()

    Page.visit(StartPage)
    cy.contains('Go to search page').click()
  })

  describe('General page content', () => {
    it('can see their user name', () => {
      const page = Page.verifyOnPage(SearchPage)
      page.header.userName.contains('M. Tester')
    })

    it('Can see the phase banner', () => {
      const page = Page.verifyOnPage(SearchPage)
      page.header.phaseBanner.contains('DEV')
    })

    it('Can see service information', () => {
      const page = Page.verifyOnPage(SearchPage)
      page.serviceInformation.should('exist')
    })

    it('Can go back to the start page', () => {
      const page = Page.verifyOnPage(SearchPage)

      page.backButton.click()
      Page.verifyOnPage(StartPage)
    })

    it('Is accessible', () => {
      const page = Page.verifyOnPage(SearchPage)
      page.checkIsAccessible()
    })
  })

  describe('Order search form', () => {
    it('Displays Legacy subject ID field', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.form.legacySubjectIdField.shouldNotBeDisabled()
    })

    it('Displays First name field', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.form.firstNameField.shouldNotBeDisabled()
    })

    it('Displays Last name field', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.form.lastNameField.shouldNotBeDisabled()
    })

    it('Displays Date of birth fields', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.form.dateOfBirthField.shouldNotBeDisabled()
    })

    it('Displays Alias field', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.form.aliasField.shouldNotBeDisabled()
    })

    it('Displays Search button', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.form.searchButton.should('be.visible')
    })
  })

  it('Should display empty form validation error message', () => {
    const page = Page.verifyOnPage(SearchPage)

    page.form.searchButton.click()

    Page.verifyOnPage(SearchPage)

    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError(expectedValidationErrors.form)
  })

  it('Should display first name validation error messages', () => {
    const page = Page.verifyOnPage(SearchPage)

    page.form.firstNameField.set('John123')
    page.form.searchButton.click()

    Page.verifyOnPage(SearchPage)

    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError(expectedValidationErrors.firstName)

    page.form.firstNameField.shouldHaveValidationMessage(expectedValidationErrors.firstName)
    page.form.lastNameField.shouldNotHaveValidationMessage()
    page.form.aliasField.shouldNotHaveValidationMessage()
  })

  it('Should display last name validation error messages', () => {
    const page = Page.verifyOnPage(SearchPage)

    page.form.lastNameField.set('Smith123')
    page.form.searchButton.click()

    Page.verifyOnPage(SearchPage)

    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError(expectedValidationErrors.lastName)

    page.form.firstNameField.shouldNotHaveValidationMessage()
    page.form.lastNameField.shouldHaveValidationMessage(expectedValidationErrors.lastName)
    page.form.aliasField.shouldNotHaveValidationMessage()
  })

  it('Should display alias validation error messages', () => {
    const page = Page.verifyOnPage(SearchPage)

    page.form.aliasField.set('John Smith-123')
    page.form.searchButton.click()

    Page.verifyOnPage(SearchPage)

    page.errorSummary.shouldExist()
    page.errorSummary.shouldHaveError(expectedValidationErrors.alias)

    page.form.firstNameField.shouldNotHaveValidationMessage()
    page.form.lastNameField.shouldNotHaveValidationMessage()
    page.form.aliasField.shouldHaveValidationMessage(expectedValidationErrors.alias)
  })
})
