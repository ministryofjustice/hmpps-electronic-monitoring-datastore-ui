import Page from '../../pages/page'
import IntegrityOrderSummaryPage from '../../pages/integrity/summary'
import SearchPage from '../../pages/search'
import { IntegrityOrderDetails } from '../../../server/data/models/integrityOrderDetails'

context('Integrity Order Summary', () => {
  const legacySubjectId = '1234567'

  describe('General page content', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

      cy.task('stubIntegrityGetOrderDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: {
          specials: 'no',
          legacySubjectId,
          firstName: 'Testopher',
          lastName: 'Fakesmith',
          alias: 'an old tv show',
          dateOfBirth: '1950-01-01',
          primaryAddressLine1: '123 Fourth Street',
          primaryAddressLine2: 'Fiveton',
          primaryAddressLine3: 'Sixbury',
          primaryAddressPostCode: '7AB 8CD',
          orderStartDate: '2010-01-01',
          orderEndDate: '2030-01-01',
          offenceRisk: false,
        } as IntegrityOrderDetails,
      })

      cy.signIn()
    })

    it('can see their user name', () => {
      const page = Page.visit(IntegrityOrderSummaryPage, { legacySubjectId })
      page.header.userName.contains('M. Tester')
    })

    it('Can see the phase banner', () => {
      const page = Page.visit(IntegrityOrderSummaryPage, { legacySubjectId })
      page.header.phaseBanner.contains('DEV')
    })

    it('Can see service information', () => {
      const searchResultsPage = Page.visit(IntegrityOrderSummaryPage, { legacySubjectId })
      searchResultsPage.serviceInformation.should('exist')
    })

    it('Can go back to the search page', () => {
      const page = Page.visit(IntegrityOrderSummaryPage, { legacySubjectId })

      page.backButton.click()
      Page.verifyOnPage(SearchPage)
    })

    it('Is accessible', () => {
      const page = Page.visit(IntegrityOrderSummaryPage, { legacySubjectId })
      page.checkIsAccessible()
    })
  })

  describe('Order information details', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

      cy.task('stubIntegrityGetOrderDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: {
          specials: 'no',
          legacySubjectId,
          firstName: 'Testopher',
          lastName: 'Fakesmith',
          alias: 'an old tv show',
          dateOfBirth: '1950-01-01',
          primaryAddressLine1: '123 Fourth Street',
          primaryAddressLine2: 'Fiveton',
          primaryAddressLine3: 'Sixbury',
          primaryAddressPostCode: '7AB 8CD',
          orderStartDate: '2010-01-01',
          orderEndDate: '2030-01-01',
          offenceRisk: false,
        } as IntegrityOrderDetails,
      })

      cy.signIn()
    })

    it('Display a summary of the order', () => {
      const summaryPage = Page.visit(IntegrityOrderSummaryPage, { legacySubjectId })

      summaryPage.summaryDetails.shouldHaveItem('Specials', 'no')
      summaryPage.summaryDetails.shouldHaveItem('Legacy Subject ID', legacySubjectId)
      summaryPage.summaryDetails.shouldHaveItem('Name', 'Testopher Fakesmith')
      summaryPage.summaryDetails.shouldHaveItem('Alias', 'an old tv show')
      summaryPage.summaryDetails.shouldHaveItem('Date of birth', '1 January 1950')
      summaryPage.summaryDetails.shouldHaveItem('Primary address', '123 Fourth StreetFivetonSixbury7AB 8CD')
      summaryPage.summaryDetails.shouldHaveItem('Order start date', '1 January 2010')
      summaryPage.summaryDetails.shouldHaveItem('Order end date', '1 January 2030')
    })
  })
})
