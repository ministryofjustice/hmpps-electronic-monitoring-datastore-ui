import Page from '../../pages/page'
import IntegritySearchResultsPage from '../../pages/integrity/searchResults'
import SearchPage from '../../pages/search'

context('Integrity search results', () => {
  const queryExecutionId = 'query-execution-id'

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

  it('can see their user name', () => {
    const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
    page.header.userName.contains('M. Tester')
  })

  it('Can see the phase banner', () => {
    const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
    page.header.phaseBanner.contains('DEV')
  })

  it('Can see service information', () => {
    const searchResultsPage = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
    searchResultsPage.serviceInformation.should('exist')
  })

  it('Can go back to the search page', () => {
    const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })

    page.backButton.click()
    Page.verifyOnPage(SearchPage)
  })

  it('Can return to search page', () => {
    const searchResultsPage = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })

    searchResultsPage.returnToSearchButton.click()
    Page.verifyOnPage(SearchPage)
  })

  it('Is accessible', () => {
    const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
    page.checkIsAccessible()
  })
})
