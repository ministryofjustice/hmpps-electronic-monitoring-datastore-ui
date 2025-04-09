import Page from '../../pages/page'
import AlcoholMonitoringSearchResultsPage from '../../pages/alcoholMonitoring/searchResults'
import SearchPage from '../../pages/search'

context('Alcohol monitoring search results', () => {
  const queryExecutionId = 'query-execution-id'

  describe('When no results are found', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })
      cy.task('stubIntegrityGetSearchResults', {
        queryExecutionId,
        httpStatus: 200,
        results: [],
      })
      cy.signIn()
    })

    it('Explains that no results were found', () => {
      Page.visit(AlcoholMonitoringSearchResultsPage, {}, { search_id: queryExecutionId })
      cy.contains('No results found')
      cy.contains('Sorry, no results were found for this search')
    })

    it('Displays no search results', () => {
      const searchResultsPage = Page.visit(AlcoholMonitoringSearchResultsPage, {}, { search_id: queryExecutionId })
      searchResultsPage.results.shouldNotExist()
    })

    it('Displays no pagination', () => {
      const searchResultsPage = Page.visit(AlcoholMonitoringSearchResultsPage, {}, { search_id: queryExecutionId })
      searchResultsPage.pagination.shouldNotExist()
    })

    it('Can return to search page', () => {
      const searchResultsPage = Page.visit(AlcoholMonitoringSearchResultsPage, {}, { search_id: queryExecutionId })

      searchResultsPage.returnToSearchButton.click()
      Page.verifyOnPage(SearchPage)
    })

    it('Is accessible', () => {
      const page = Page.visit(AlcoholMonitoringSearchResultsPage, {}, { search_id: queryExecutionId })
      page.checkIsAccessible()
    })
  })
})
