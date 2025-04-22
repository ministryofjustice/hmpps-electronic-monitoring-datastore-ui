import Page from '../../pages/page'

import SearchPage from '../../pages/search'
import AlcoholMonitoringOrderSummaryPage from '../../pages/alcoholMonitoring/summary'

import { AlcoholMonitoringOrderSummary } from '../../../server/models/alcoholMonitoring/orderSummary'

context('Alcohol Monitoring Order Summary', () => {
  const legacySubjectId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.signIn()
  })

  describe('General page content', () => {
    beforeEach(() => {
      cy.task('stubAlcoholMonitoringGetOrderSummary', {
        httpStatus: 200,
        legacySubjectId,
        body: {
          legacySubjectId,
          firstName: 'Testopher',
          lastName: 'Fakesmith',
          alias: 'an old tv show',
          dateOfBirth: '1950-01-01',
          postcode: '7AB 8CD',
          address1: '123 Fourth Street',
          address2: 'Fiveton',
          address3: 'Sixbury',
          orderStartDate: '2010-01-01T00:00:00',
          orderEndDate: '2030-01-01T00:00:00',
        } as AlcoholMonitoringOrderSummary,
      })
    })

    it('can see their user name', () => {
      const page = Page.visit(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })
      page.header.userName.contains('M. Tester')
    })

    it('Can see the phase banner', () => {
      const page = Page.visit(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })
      page.header.phaseBanner.contains('DEV')
    })

    it('Can see service information', () => {
      const searchResultsPage = Page.visit(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })
      searchResultsPage.serviceInformation.should('exist')
    })

    it('Can go back to the search page', () => {
      const page = Page.visit(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })

      page.backButton.click()
      Page.verifyOnPage(SearchPage)
    })

    it('Is accessible', () => {
      const page = Page.visit(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })
      page.checkIsAccessible()
    })
  })

  describe('Order information', () => {
    it('Displays a summary of the order', () => {
      cy.task('stubAlcoholMonitoringGetOrderSummary', {
        httpStatus: 200,
        legacySubjectId,
        body: {
          legacySubjectId,
          firstName: 'Testopher',
          lastName: 'Fakesmith',
          alias: 'an old tv show',
          dateOfBirth: '1950-01-01',
          postcode: '7AB 8CD',
          address1: '123 Fourth Street',
          address2: 'Fiveton',
          address3: 'Sixbury',
          orderStartDate: '2010-01-01T00:00:00',
          orderEndDate: '2030-01-01T00:00:00',
        } as AlcoholMonitoringOrderSummary,
      })

      const page = Page.visit(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })

      page.summaryDetails.shouldHaveItem('Legacy Subject ID', legacySubjectId)
      page.summaryDetails.shouldHaveItem('Name', 'Testopher Fakesmith')
      page.summaryDetails.shouldHaveItem('Alias', 'an old tv show')
      page.summaryDetails.shouldHaveItem('Date of birth', '1 January 1950')
      page.summaryDetails.shouldHaveItem('Primary address', '123 Fourth StreetFivetonSixbury7AB 8CD')
      page.summaryDetails.shouldHaveItem('Order start date', '1 January 2010')
      page.summaryDetails.shouldHaveItem('Order end date', '1 January 2030')
    })

    it('Summary can be empty and still display', () => {
      cy.task('stubAlcoholMonitoringGetOrderSummary', {
        httpStatus: 200,
        legacySubjectId,
        body: {
          legacySubjectId: 'AAMR321',
          firstName: null,
          lastName: null,
          alias: null,
          dateOfBirth: null,
          address1: null,
          address2: null,
          address3: null,
          postcode: null,
          orderStartDate: null,
          orderEndDate: null,
        } as AlcoholMonitoringOrderSummary,
      })

      const page = Page.visit(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })

      page.summaryDetails.shouldBeVisible()
    })
  })
})
