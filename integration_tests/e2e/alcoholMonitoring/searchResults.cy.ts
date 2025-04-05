import Page from '../../pages/page'
import AlcoholMonitoringSearchResults from '../../pages/alcoholMonitoring/searchResults'
import orders from '../../../server/data/mockData/orders'

context('Alcohol monitoring search results', () => {
  const queryExecutionId = 'query-execution-id'

  describe('No results found view', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })
      cy.task('stubDatastoreGetSearchResults', {
        queryExecutionId,
        httpStatus: 200,
        results: [],
      })
      cy.signIn()
    })

    it('Should display the user name visible in header', () => {
      const page = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
      page.header.userName.should('contain.text', 'M. Tester')
    })

    it('Should display the phase banner in header', () => {
      const page = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
      page.header.phaseBanner.should('contain.text', 'DEV')
    })

    it('Should display the back link', () => {
      const page = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })

      page.backButton.should('exist')
    })

    it('Should be accessible', () => {
      const page = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
      page.checkIsAccessible()
    })

    describe('Service information banner', () => {
      it('Service information banner renders', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.serviceInformation().should('be.visible')
      })

      it('Service information banner text is correct', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage
          .serviceInformation()
          .should('contain', 'This service gives you access to all order data that was held by Capita and G4S')
      })
    })

    describe('No results message', () => {
      it('No results heading renders', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.noResultsHeader().should('be.visible')
      })

      it('No results heading text is correct', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.noResultsHeader().should('contain', 'No results found')
      })

      it('No results message renders', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.noResultsMessage().should('be.visible')
      })

      it('No results message text is correct', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.noResultsMessage().should('contain', 'Sorry, no results were found for this search')
      })
    })

    describe('Return to search page button', () => {
      it('Return to search page button renders', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.returnToSearchButton().should('be.visible')
      })

      it('Return to search page button href is correct', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.returnToSearchButton().should('have.attr', 'href', '/search')
      })
    })
  })

  describe('Results found view', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

      cy.task('stubDatastoreGetSearchResults', {
        queryExecutionId,
        httpStatus: 200,
        results: orders,
      })

      cy.signIn()
    })

    it('is reachable', () => {
      cy.visit(`/alcohol-monitoring?search_id=${queryExecutionId}`)
      Page.verifyOnPage(AlcoholMonitoringSearchResults)
    })

    describe('Service information banner', () => {
      it('Service information banner renders', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.serviceInformation().should('be.visible')
      })

      it('Service information banner text is correct', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage
          .serviceInformation()
          .should('contain', 'This service gives you access to all order data that was held by Capita and G4S')
      })
    })

    describe('Search results table', () => {
      it('The table renders', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.resultsTable().should('be.visible')
      })

      it('The subject ID column header contains the correct text', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.subjectIdHeader().should('contain', 'Legacy subject ID')
      })

      it('The name column header contains the correct text', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.nameHeader().should('contain', 'Name')
      })

      it('The date of birth column header contains the correct text', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.dateOfBirthHeader().should('contain', 'Date of birth')
      })

      it('The order start date column header contains the correct text', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.orderStartDateHeader().should('contain', 'Order start date')
      })

      it('The order end date column header contains the correct text', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.orderEndDateHeader().should('contain', 'Order end date')
      })
    })

    describe('Pagination', () => {
      it('The pagination component renders', () => {
        const searchResultsPage = Page.visit(AlcoholMonitoringSearchResults, {}, { search_id: queryExecutionId })
        searchResultsPage.pagination().should('be.visible')
      })
    })
  })
})
