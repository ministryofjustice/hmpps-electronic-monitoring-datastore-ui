import SearchResultsPage from '../pages/searchResults'
import Page from '../pages/page'

context('SearchResults', () => {
  beforeEach(() => {
    // cy.task('reset')
    // cy.task('stubSignIn')
    cy.visit('/search-results')
  })

  describe('Service information banner', () => {
    it('Service information banner renders', () => {
      const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
      searchResultsPage.serviceInformation().should('be.visible')
    })

    it('Service information banner text is correct', () => {
      const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
      searchResultsPage
        .serviceInformation()
        .should(
          'contain',
          'This service gives you access to all case data that was held by Capita and G4S from [date] to [date]',
        )
    })
  })

  describe('Search results table', () => {
    it('The table renders', () => {
      const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
      searchResultsPage.resultsTable().should('be.visible')
    })

    it('The subject ID column header contains the correct text', () => {
      const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
      searchResultsPage.subjectIdHeader().should('contain', 'Subject ID')
    })

    it('The name column header contains the correct text', () => {
      const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
      searchResultsPage.nameHeader().should('contain', 'Name')
    })

    it('The date of birth column header contains the correct text', () => {
      const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
      searchResultsPage.dateOfBirthHeader().should('contain', 'Date of birth')
    })

    it('The order start date column header contains the correct text', () => {
      const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
      searchResultsPage.orderStartDateHeader().should('contain', 'Order start date')
    })
  })

  describe('Pagination', () => {
    it('The pagination component renders', () => {
      const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
      searchResultsPage.pagination().should('be.visible')
    })
  })
})
