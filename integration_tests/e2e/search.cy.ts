import SearchPage from '../pages/search'
import Page from '../pages/page'

context('Search', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit('/search')
  })

  it('is reachable', () => {
    Page.verifyOnPage(SearchPage)
  })

  describe('Service information banner', () => {
    it('Service information banner renders', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.serviceInformation().should('be.visible')
    })

    it('Service information banner text is correct', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage
        .serviceInformation()
        .should('contain', 'This service gives you access to all order data that was held by Capita and G4S')
    })
  })

  describe('Subject ID field', () => {
    it('Subject ID field renders', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.subjectIdField().should('be.visible')
    })

    it('Subject ID label renders', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.subjectIdLabel().should('be.visible')
      searchPage.subjectIdLabel().should('be.visible')
    })

    it('Subject ID label text is correct', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.subjectIdLabel().should('contain', 'Subject Id')
    })
  })

  describe('First name field', () => {
    it('First name field renders', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.firstNameField().should('be.visible')
    })

    it('First name label renders', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.firstNameLabel().should('be.visible')
      searchPage.firstNameLabel().should('be.visible')
    })

    it('First name label text is correct', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.firstNameLabel().should('contain', 'First name')
    })
  })

  describe('Last name field', () => {
    it('Last name field renders', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.lastNameField().should('be.visible')
    })

    it('Last name label renders', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.lastNameLabel().should('be.visible')
      searchPage.lastNameLabel().should('be.visible')
    })

    it('Last name label text is correct', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.lastNameLabel().should('contain', 'Last name')
    })
  })

  describe('Date of birth fields', () => {
    it('Date of birth fields render', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.dayOfBirthField().should('be.visible')
      searchPage.yearOfBirthField().should('be.visible')
      searchPage.monthOfBirthField().should('be.visible')
    })

    it('Date of birth label texts are correct', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.dayOfBirthLabel().should('contain', 'Day')
      searchPage.monthOfBirthLabel().should('contain', 'Month')
      searchPage.yearOfBirthLabel().should('contain', 'Year')
    })

    it('Date of birth legend text is correct', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.dateOfBirthLegend().should('contain', 'Date of birth')
    })
  })

  describe('Alias field', () => {
    it('Alias field renders', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.aliasField().should('be.visible')
    })

    it('Alias label renders', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.aliasLabel().should('be.visible')
      searchPage.aliasLabel().should('be.visible')
    })

    it('Alias label text is correct', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.aliasLabel().should('contain', 'Alias')
    })
  })

  describe('Search button', () => {
    it('Search button renders', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.searchButton().should('be.visible')
    })

    it('Search button text is correct', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.searchButton().should('contain', 'Search')
    })
  })
})
