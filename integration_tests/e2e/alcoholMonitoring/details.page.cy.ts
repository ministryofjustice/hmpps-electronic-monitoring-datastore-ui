import Page from '../../pages/page'

import AlcoholMonitoringOrderDetailsPage from '../../pages/alcoholMonitoring/details'
import AlcoholMonitoringOrderSummaryPage from '../../pages/alcoholMonitoring/summary'

import { AlcoholMonitoringOrderDetails } from '../../../server/models/alcoholMonitoring/orderDetails'

context('Alcohol Monitoring Order Details', () => {
  const legacySubjectId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.signIn()
  })

  describe('General page content', () => {
    beforeEach(() => {
      cy.task('stubAlcoholMonitoringGetOrderDetails', {
        httpStatus: 200,
        legacySubjectId,
      })
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

  describe('Order details', () => {
    it('Details can be empty and still display', () => {
      cy.task('stubAlcoholMonitoringGetOrderDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            legacyOrderId: 'OMR123',
          } as AlcoholMonitoringOrderDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringOrderDetailsPage, { legacySubjectId })

      page.deviceWearerDetails.shouldBeVisible()
      page.deviceWearerDetails.shouldBeVisible()
    })

    it('Display the device wearers details', () => {
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
          phoneNumber: '09876543210',
          address1: '123 Fourth Street',
          address2: 'Fiveton',
          address3: 'Sixbury',
          postcode: '7AB 8CD',
        } as AlcoholMonitoringOrderDetails,
      })

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
      cy.task('stubAlcoholMonitoringGetOrderDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: {
          legacySubjectId,
          legacyOrderId: legacySubjectId,
          orderStartDate: '2010-01-01T00:00:00',
          specialInstructions: 'Special instructions',
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

      const page = Page.visit(AlcoholMonitoringOrderDetailsPage, { legacySubjectId })

      page.orderDetails.shouldHaveItem('Order start date', '1 January 2010')
      page.orderDetails.shouldHaveItem('Order end date', '1 January 2030')
      page.orderDetails.shouldHaveItem('Order type', 'Community')
      page.orderDetails.shouldHaveItem('Order type description', 'lovely and green')
      page.orderDetails.shouldHaveItem('Order end outcome', 'A good outcome')
      page.orderDetails.shouldHaveItem('Special instructions', 'Special instructions')
      page.orderDetails.shouldHaveItem('Enforceable condition', 'Enforceable condition')
      page.orderDetails.shouldHaveItem('Tag at sourced', 'no')
      page.orderDetails.shouldHaveItem('Responsible organisation phone number', '01234567890')
      page.orderDetails.shouldHaveItem('Responsible organisation email', 'a@b.c')
    })
  })
})
