import Page from '../../pages/page'
import IntegritySearchResultsPage from '../../pages/integrity/searchResults'
import { IntegrityOrderDetails } from '../../../server/data/models/integrityOrderDetails'

context('Integrity search results', () => {
  const queryExecutionId = 'query-execution-id'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.signIn()
  })

  describe('When one result is found', () => {
    beforeEach(() => {
      cy.task('stubGetIntegritySearchResults', {
        queryExecutionId,
        httpStatus: 200,
        results: [
          {
            dataType: 'integrity',
            legacySubjectId: '100',
            firstName: 'Amy',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: null,
            dateOfBirth: '1970-01-01T00:00:00',
            orderStartDate: '2019-02-08T00:00:00',
            orderEndDate: '2020-02-08T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
        ],
      })
    })

    it('Displays the correct headers', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.results.shouldHaveHeaders([
        'Legacy subject ID',
        'Name',
        'Address',
        'Date of birth',
        'Order start date',
        'Order end date',
      ])
    })

    it('Displays the result', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })

      page.results.shouldHaveCount(1)

      page.results.shouldHaveResults([
        [
          '100',
          'AMY SMITH',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '1 January 1970',
          '8 February 2019',
          '8 February 2020',
        ],
      ])
    })

    it('The pagination component is not displayed', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.pagination.shouldNotBeVisible()
    })
  })

  describe('When less than 10 results are found', () => {
    beforeEach(() => {
      cy.task('stubGetIntegritySearchResults', {
        queryExecutionId,
        httpStatus: 200,
        results: [
          {
            dataType: 'integrity',
            legacySubjectId: '100',
            firstName: 'Amy',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: null,
            dateOfBirth: '1970-01-01T00:00:00',
            orderStartDate: '2019-02-08T00:00:00',
            orderEndDate: '2020-02-08T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
          {
            dataType: 'integrity',
            legacySubjectId: '200',
            firstName: 'Bill',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: 'Plato',
            dateOfBirth: '1971-01-01T00:00:00',
            orderStartDate: '2020-02-08T00:00:00',
            orderEndDate: '2021-02-08T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
        ],
      })
    })

    it('Displays the correct headers', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.results.shouldHaveHeaders([
        'Legacy subject ID',
        'Name',
        'Address',
        'Date of birth',
        'Order start date',
        'Order end date',
      ])
    })

    it('Displays all the results', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })

      page.results.shouldHaveCount(2)

      page.results.shouldHaveResults([
        [
          '100',
          'AMY SMITH',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '1 January 1970',
          '8 February 2019',
          '8 February 2020',
        ],
        [
          '200',
          'BILL SMITH Alias: Plato',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '1 January 1971',
          '8 February 2020',
          '8 February 2021',
        ],
      ])
    })

    it('The pagination component is not displayed', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.pagination.shouldNotBeVisible()
    })
  })

  describe('When more than 10 results are found', () => {
    beforeEach(() => {
      cy.task('stubGetIntegritySearchResults', {
        queryExecutionId,
        httpStatus: 200,
        results: [
          {
            dataType: 'integrity',
            legacySubjectId: '100',
            firstName: 'Amy',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: null,
            dateOfBirth: '1970-01-01T00:00:00',
            orderStartDate: '2019-02-08T00:00:00',
            orderEndDate: '2020-02-08T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
          {
            dataType: 'integrity',
            legacySubjectId: '200',
            firstName: 'Bill',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: 'Plato',
            dateOfBirth: '1971-01-01T00:00:00',
            orderStartDate: '2020-02-08T00:00:00',
            orderEndDate: '2021-02-08T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
          {
            dataType: 'integrity',
            legacySubjectId: '3000000',
            firstName: 'Claire',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: null,
            dateOfBirth: '1962-04-09T00:00:00',
            orderStartDate: '2001-08-05T00:00:00',
            orderEndDate: '2002-08-05T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
          {
            dataType: 'integrity',
            legacySubjectId: '8000000',
            firstName: 'Daniel',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: 'Aristotle',
            dateOfBirth: '1978-11-12T00:00:00',
            orderStartDate: '2012-02-18T00:00:00',
            orderEndDate: '2014-02-18T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
          {
            dataType: 'integrity',
            legacySubjectId: '30000',
            firstName: 'Emma',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: 'Socrates',
            dateOfBirth: '2001-03-03T00:00:00',
            orderStartDate: '2017-01-24T00:00:00',
            orderEndDate: '2020-01-24T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
          {
            dataType: 'integrity',
            legacySubjectId: '4000000',
            firstName: 'Fred',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: null,
            dateOfBirth: '1980-10-08T00:00:00',
            orderStartDate: '2021-05-01T00:00:00',
            orderEndDate: '2022-01-05T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
          {
            dataType: 'integrity',
            legacySubjectId: '30000',
            firstName: 'Geoff',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: 'Socrates',
            dateOfBirth: '2001-03-03T00:00:00',
            orderStartDate: '2017-01-24T00:00:00',
            orderEndDate: '2020-01-24T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
          {
            dataType: 'integrity',
            legacySubjectId: '4000000',
            firstName: 'Hortense',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: null,
            dateOfBirth: '1980-10-08T00:00:00',
            orderStartDate: '2021-05-01T00:00:00',
            orderEndDate: '2022-05-01T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
          {
            dataType: 'integrity',
            legacySubjectId: '30000',
            firstName: 'Isaac',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: 'Socrates',
            dateOfBirth: '2001-03-03T00:00:00',
            orderStartDate: '2017-01-24T00:00:00',
            orderEndDate: '2020-01-24T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
          {
            dataType: 'integrity',
            legacySubjectId: '4000000',
            firstName: 'Jessica',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: null,
            dateOfBirth: '1980-10-08T00:00:00',
            orderStartDate: '2021-05-01T00:00:00',
            orderEndDate: '2022-05-01T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
          {
            dataType: 'integrity',
            legacySubjectId: '30000',
            firstName: 'Ken',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: 'Socrates',
            dateOfBirth: '2001-03-03T00:00:00',
            orderStartDate: '2017-01-24T00:00:00',
            orderEndDate: '2020-01-24T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
          {
            dataType: 'integrity',
            legacySubjectId: '4000000',
            firstName: 'Lucille',
            lastName: 'Smith',
            primaryAddressLine1: 'First line of address',
            primaryAddressLine2: 'Second line of address',
            primaryAddressLine3: 'Third line of address',
            primaryAddressPostCode: 'PostCode',
            alias: null,
            dateOfBirth: '1980-10-08T00:00:00',
            orderStartDate: '2021-05-01T00:00:00',
            orderEndDate: '2022-05-01T00:00:00',
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
        ],
      })
    })

    it('Displays the correct headers', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.results.shouldHaveHeaders([
        'Legacy subject ID',
        'Name',
        'Address',
        'Date of birth',
        'Order start date',
        'Order end date',
      ])
    })

    it('Displays the first 10 results', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })

      page.results.shouldHaveCount(12)

      page.results.shouldHaveResults([
        [
          '100',
          'AMY SMITH',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '1 January 1970',
          '8 February 2019',
          '8 February 2020',
        ],
        [
          '200',
          'BILL SMITH Alias: Plato',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '1 January 1971',
          '8 February 2020',
          '8 February 2021',
        ],
        [
          '30000',
          'EMMA SMITH Alias: Socrates',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '3 March 2001',
          '24 January 2017',
          '24 January 2020',
        ],
        [
          '30000',
          'GEOFF SMITH Alias: Socrates',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '3 March 2001',
          '24 January 2017',
          '24 January 2020',
        ],
        [
          '30000',
          'ISAAC SMITH Alias: Socrates',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '3 March 2001',
          '24 January 2017',
          '24 January 2020',
        ],
        [
          '30000',
          'KEN SMITH Alias: Socrates',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '3 March 2001',
          '24 January 2017',
          '24 January 2020',
        ],
        [
          '3000000',
          'CLAIRE SMITH',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '9 April 1962',
          '5 August 2001',
          '5 August 2002',
        ],
        [
          '4000000',
          'FRED SMITH',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '8 October 1980',
          '1 May 2021',
          '5 January 2022',
        ],
        [
          '4000000',
          'HORTENSE SMITH',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '8 October 1980',
          '1 May 2021',
          '1 May 2022',
        ],
        [
          '4000000',
          'JESSICA SMITH',
          'First line of addressSecond line of addressThird line of addressPostCode',
          '8 October 1980',
          '1 May 2021',
          '1 May 2022',
        ],
      ])
    })

    it('Pagination is displayed', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.pagination.shouldBeVisible()
    })

    it('Summary is displayed', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.pagination.shouldShowSummary(1, 10, 12)
    })

    it('Highlights first page', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.pagination.shouldShowActivePage(1)
    })

    it('Can navigate to second page', () => {
      let page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.pagination.pageLink(2).click()

      page = Page.verifyOnPage(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.results.shouldHaveCount(12)
      page.pagination.shouldShowSummary(11, 12, 12)
      page.pagination.shouldShowActivePage(2)
    })

    it('Can navigate to next page', () => {
      let page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.pagination.nextLink.click()

      page = Page.verifyOnPage(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.results.shouldHaveCount(12)
      page.pagination.shouldShowSummary(11, 12, 12)
      page.pagination.shouldShowActivePage(2)
    })

    it('Can navigate back to first page', () => {
      let page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.results.shouldHaveCount(12)
      page.pagination.pageLink(2).click()

      page = Page.verifyOnPage(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.results.shouldHaveCount(12)
      page.pagination.pageLink(1).click()

      page = Page.verifyOnPage(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.results.shouldHaveCount(12)
      page.pagination.shouldShowActivePage(1)
    })

    it('Can navigate back to previous page', () => {
      let page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.pagination.nextLink.click()

      page = Page.verifyOnPage(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.pagination.previousLink.click()

      page = Page.verifyOnPage(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.pagination.shouldShowActivePage(1)
    })
  })

  describe('When the result has minimal details', () => {
    beforeEach(() => {
      cy.task('stubGetIntegritySearchResults', {
        queryExecutionId,
        httpStatus: 200,
        results: [
          {
            dataType: 'integrity',
            legacySubjectId: 'AAMR100',
            firstName: null,
            lastName: null,
            primaryAddressLine1: null,
            primaryAddressLine2: null,
            primaryAddressLine3: null,
            primaryAddressPostCode: null,
            alias: null,
            dateOfBirth: null,
            orderStartDate: null,
            orderEndDate: null,
            specials: 'no',
            offenceRisk: false,
          } as IntegrityOrderDetails,
        ],
      })
    })

    it('Displays the correct headers', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.results.shouldHaveHeaders([
        'Legacy subject ID',
        'Name',
        'Address',
        'Date of birth',
        'Order start date',
        'Order end date',
      ])
    })

    it('Displays the result', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })

      page.results.shouldHaveResults([['AAMR100', '', '', '', '', '']])
    })

    it('The pagination component is not displayed', () => {
      const page = Page.visit(IntegritySearchResultsPage, {}, { search_id: queryExecutionId })
      page.pagination.shouldNotBeVisible()
    })
  })
})
