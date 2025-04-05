import Page from '../pages/page'
import SearchPage from '../pages/search'

context('Search', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })
    cy.signIn()
  })

  it('Should display the user name visible in header', () => {
    const page = Page.visit(SearchPage)
    page.header.userName.should('contain.text', 'M. Tester')
  })

  it('Should display the phase banner in header', () => {
    const page = Page.visit(SearchPage)
    page.header.phaseBanner.should('contain.text', 'DEV')
  })

  it('Should display the back link', () => {
    const page = Page.visit(SearchPage)

    page.backButton.should('exist')
  })

  it('Should be accessible', () => {
    const page = Page.visit(SearchPage)
    page.checkIsAccessible()
  })

  describe('Service information banner', () => {
    it('Service information banner is displayed', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.serviceInformation().should('be.visible')
    })

    it('Service information banner text is correct', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage
        .serviceInformation()
        .should('contain', 'This service gives you access to all order data that was held by Capita and G4S')
    })
  })

  describe('Subject ID field', () => {
    it('Subject ID field is displayed', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.subjectIdField().should('be.visible')
    })

    it('Subject ID label is displayed', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.subjectIdLabel().should('be.visible')
    })

    it('Subject ID label text is correct', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.subjectIdLabel().should('contain', 'Subject Id')
    })
  })

  describe('First name field', () => {
    it('First name field is displayed', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.firstNameField().should('be.visible')
    })

    it('First name label is displayed', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.firstNameLabel().should('be.visible')
    })

    it('First name label text is correct', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.firstNameLabel().should('contain', 'First name')
    })
  })

  describe('Last name field', () => {
    it('Last name field is displayed', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.lastNameField().should('be.visible')
    })

    it('Last name label is displayed', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.lastNameLabel().should('be.visible')
    })

    it('Last name label text is correct', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.lastNameLabel().should('contain', 'Last name')
    })
  })

  describe('Date of birth fields', () => {
    it('Date of birth fields render', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.dayOfBirthField().should('be.visible')
      searchPage.yearOfBirthField().should('be.visible')
      searchPage.monthOfBirthField().should('be.visible')
    })

    it('Date of birth label texts are correct', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.dayOfBirthLabel().should('contain', 'Day')
      searchPage.monthOfBirthLabel().should('contain', 'Month')
      searchPage.yearOfBirthLabel().should('contain', 'Year')
    })

    it('Date of birth legend text is correct', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.dateOfBirthLegend().should('contain', 'Date of birth')
    })
  })

  describe('Alias field', () => {
    it('Alias field is displayed', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.aliasField().should('be.visible')
    })

    it('Alias label is displayed', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.aliasLabel().should('be.visible')
    })

    it('Alias label text is correct', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.aliasLabel().should('contain', 'Alias')
    })
  })

  describe('Search button', () => {
    it('Search button is displayed', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.searchButton().should('be.visible')
    })

    it('Search button text is correct', () => {
      const searchPage = Page.visit(SearchPage)
      searchPage.searchButton().should('contain', 'Search')
    })
  })
})
