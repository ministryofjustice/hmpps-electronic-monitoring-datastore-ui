// TODO: Routing to the searchResults page and the associated integration tests need to be updated.
import SearchResultsPage from '../pages/searchResults'
import Page from '../pages/page'
import orders from '../../server/data/mockData/orders'

context('SearchResults', () => {
  describe('No results found view', () => {
    const queryExecutionId = 'query-execution-id'

    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn')
      cy.task('stubDatastoreGetSearchResults', {
        queryExecutionId: 'query-execution-id',
        httpStatus: 200,
        results: [],
      })
      cy.signIn()
      cy.visit(`/search/orders?search_id=${queryExecutionId}`)
    })

    it('is reachable', () => {
      Page.verifyOnPage(SearchResultsPage)
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
          .should('contain', 'This service gives you access to all order data that was held by Capita and G4S')
      })
    })

    describe('No results message', () => {
      it('No results heading renders', () => {
        const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
        searchResultsPage.noResultsHeader().should('be.visible')
      })

      it('No results heading text is correct', () => {
        const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
        searchResultsPage.noResultsHeader().should('contain', 'No results found')
      })

      it('No results message renders', () => {
        const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
        searchResultsPage.noResultsMessage().should('be.visible')
      })

      it('No results message text is correct', () => {
        const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
        searchResultsPage.noResultsMessage().should('contain', 'Sorry, no results were found for this search')
      })
    })

    describe('Return to search page button', () => {
      it('Return to search page button renders', () => {
        const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
        searchResultsPage.returnToSearchButton().should('be.visible')
      })

      it('Return to search page button href is correct', () => {
        const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
        searchResultsPage.returnToSearchButton().should('have.attr', 'href', '/search')
      })
    })
  })

  describe('Results found view', () => {
    const queryExecutionId = 'query-execution-id'

    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn')

      cy.task('stubDatastoreGetSearchResults', {
        queryExecutionId: 'query-execution-id',
        httpStatus: 200,
        results: orders,
      })

      cy.signIn()
      cy.visit(`/search/orders?search_id=${queryExecutionId}`)
    })

    it('is reachable', () => {
      Page.verifyOnPage(SearchResultsPage)
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
          .should('contain', 'This service gives you access to all order data that was held by Capita and G4S')
      })
    })

    describe('Search results table', () => {
      it('The table renders', () => {
        const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
        searchResultsPage.resultsTable().should('be.visible')
      })

      it('The subject ID column header contains the correct text', () => {
        const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
        searchResultsPage.subjectIdHeader().should('contain', 'Legacy subject ID')
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

      it('The order end date column header contains the correct text', () => {
        const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
        searchResultsPage.orderEndDateHeader().should('contain', 'Order end date')
      })
    })

    describe('Pagination', () => {
      it('The pagination component renders', () => {
        const searchResultsPage = Page.verifyOnPage(SearchResultsPage)
        searchResultsPage.pagination().should('be.visible')
      })
    })
  })
})
