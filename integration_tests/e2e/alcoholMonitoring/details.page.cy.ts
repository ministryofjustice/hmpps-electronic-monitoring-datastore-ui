import Page from '../../pages/page'

import AlcoholMonitoringOrderDetailsPage from '../../pages/alcoholMonitoring/details'
import AlcoholMonitoringOrderSummaryPage from '../../pages/alcoholMonitoring/summary'

import { AlcoholMonitoringOrderDetails } from '../../../server/models/alcoholMonitoring/orderDetails'

context('Alcohol Monitoring Order Details', () => {
  const legacySubjectId = '1234567'

  describe('General page content', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

      cy.task('stubAlcoholMonitoringGetOrderDetails', {
        httpStatus: 200,
        legacySubjectId,
      })

      cy.signIn()
    })

    it('can see their user name', () => {
      const page = Page.visit(AlcoholMonitoringOrderDetailsPage, { legacySubjectId })
      page.header.userName.contains('M. Tester')
    })

    it('Can see the phase banner', () => {
      const page = Page.visit(AlcoholMonitoringOrderDetailsPage, { legacySubjectId })
      page.header.phaseBanner.contains('DEV')
    })

    it('Can see service information', () => {
      const page = Page.visit(AlcoholMonitoringOrderDetailsPage, { legacySubjectId })
      page.serviceInformation.should('exist')
    })

    it('Can go back to the summary page', () => {
      cy.task('stubAlcoholMonitoringGetOrderSummary', {
        httpStatus: 200,
        legacySubjectId,
      })

      const page = Page.visit(AlcoholMonitoringOrderDetailsPage, { legacySubjectId })

      page.backButton.click()
      Page.verifyOnPage(AlcoholMonitoringOrderSummaryPage)
    })

    it('Is accessible', () => {
      const page = Page.visit(AlcoholMonitoringOrderDetailsPage, { legacySubjectId })
      page.checkIsAccessible()
    })
  })

  describe('Order information details', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

      cy.task('stubAlcoholMonitoringGetOrderDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: {
          legacySubjectId,
          legacyOrderId: legacySubjectId,
          firstName: 'Testopher',
          lastName: 'Fakesmith',
          alias: 'an old tv show',
          dateOfBirth: '1950-01-01T00:00:00',
          sex: 'Sex',
          specialInstructions: 'Special instructions',
          phoneNumber: '09876543210',
          address1: '123 Fourth Street',
          address2: 'Fiveton',
          address3: 'Sixbury',
          postcode: '7AB 8CD',
          orderStartDate: '2010-01-01T00:00:00',
          orderEndDate: '2030-01-01T00:00:00',
          enforceableCondition: 'Enforceable condition',
          orderType: 'Community',
          orderTypeDescription: 'lovely and green',
          orderEndOutcome: 'A good outcome',
          responsibleOrganisationPhoneNumber: '01234567890',
          responsibleOrganisationEmail: 'a@b.c',
          tagAtSource: 'no',
        } as AlcoholMonitoringOrderDetails,
      })

      cy.signIn()
    })

    it('Display the device wearers details', () => {
      const page = Page.visit(AlcoholMonitoringOrderDetailsPage, { legacySubjectId })

      page.deviceWearerDetails.shouldHaveItem('Legacy subject ID', legacySubjectId)
      page.deviceWearerDetails.shouldHaveItem('Legacy order ID', legacySubjectId)
      page.deviceWearerDetails.shouldHaveItem('First name', 'Testopher')
      page.deviceWearerDetails.shouldHaveItem('Last name', 'Fakesmith')
      page.deviceWearerDetails.shouldHaveItem('Alias', 'an old tv show')
      page.deviceWearerDetails.shouldHaveItem('Legacy sex', 'Sex')
      page.deviceWearerDetails.shouldHaveItem('Primary address', '123 Fourth StreetFivetonSixbury7AB 8CD')
      page.deviceWearerDetails.shouldHaveItem('Phone/mobile number', '09876543210')
    })

    it('Displays the order details', () => {
      const page = Page.visit(AlcoholMonitoringOrderDetailsPage, { legacySubjectId })

      page.deviceWearerDetails.shouldHaveItem('Order start date', '1 January 2010')
      page.deviceWearerDetails.shouldHaveItem('Order end date', '1 January 2030')
      page.deviceWearerDetails.shouldHaveItem('Order type', 'Community')
      page.deviceWearerDetails.shouldHaveItem('Order type description', 'lovely and green')
      page.deviceWearerDetails.shouldHaveItem('Order end outcome', 'A good outcome')
      page.deviceWearerDetails.shouldHaveItem('Special instructions', 'Special instructions')
      page.deviceWearerDetails.shouldHaveItem('Enforceable condition', 'Enforceable condition')
      page.deviceWearerDetails.shouldHaveItem('Tag at sourced', 'no')
      page.deviceWearerDetails.shouldHaveItem('Responsible organisation phone number', '')
      page.deviceWearerDetails.shouldHaveItem('Responsible organisation email', 'a@b.c')
    })
  })
})
