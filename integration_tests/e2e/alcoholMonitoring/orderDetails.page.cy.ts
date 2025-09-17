import Page from '../../pages/page'

import AlcoholMonitoringOrderDetailsPage from '../../pages/alcoholMonitoring/details'
import AlcoholMonitoringOrderSummaryPage from '../../pages/alcoholMonitoring/summary'

import { AlcoholMonitoringOrderDetails } from '../../../server/data/models/alcoholMonitoringOrderDetails'

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
      cy.task('stubAlcoholMonitoringGetOrderDetails', {
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
        body: {
          legacySubjectId,
          firstName: null,
          lastName: null,
          alias: null,
          dateOfBirth: null,
          sex: null,
          specialInstructions: null,
          phoneNumber: null,
          address1: null,
          address2: null,
          address3: null,
          postCode: null,
          orderStartDate: null,
          orderEndDate: null,
          enforceableCondition: null,
          orderType: null,
          orderTypeDescription: null,
          orderEndOutcome: null,
          responsibleOrganisationPhoneNumber: null,
          responsibleOrganisationEmail: null,
          tagAtSource: null,
        } as AlcoholMonitoringOrderDetails,
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
          firstName: 'John',
          lastName: 'Smith',
          alias: 'Zeno',
          dateOfBirth: '1980-02-01T00:00:00',
          sex: 'Sex',
          specialInstructions: 'Special instructions',
          phoneNumber: '09876543210',
          address1: '1 Primary Street',
          address2: 'Sutton',
          address3: 'London',
          postcode: 'ABC 123',
          orderStartDate: '2012-02-01T00:00:00',
          orderEndDate: '2013-04-03T00:00:00',
          enforceableCondition: 'Enforceable condition',
          orderType: 'Community',
          orderTypeDescription: '',
          orderEndOutcome: '',
          responsibleOrganisationPhoneNumber: '01234567890',
          responsibleOrganisationEmail: 'a@b.c',
          tagAtSource: '',
        } as AlcoholMonitoringOrderDetails,
      })

      const page = Page.visit(AlcoholMonitoringOrderDetailsPage, { legacySubjectId })

      page.deviceWearerDetails.shouldHaveItem('Legacy subject ID', legacySubjectId)
      page.deviceWearerDetails.shouldHaveItem('First name', 'John')
      page.deviceWearerDetails.shouldHaveItem('Last name', 'Smith')
      page.deviceWearerDetails.shouldHaveItem('Alias', 'Zeno')
      page.deviceWearerDetails.shouldHaveItem('Date of birth', '1 February 1980')
      page.deviceWearerDetails.shouldHaveItem('Legacy sex', 'Sex')
      page.deviceWearerDetails.shouldHaveItem('Primary address', '1 Primary StreetSuttonLondonABC 123')
      page.deviceWearerDetails.shouldHaveItem('Phone/mobile number', '09876543210')
    })

    it('Displays the order details', () => {
      cy.task('stubAlcoholMonitoringGetOrderDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: {
          legacySubjectId,
          firstName: 'John',
          lastName: 'Smith',
          alias: 'Zeno',
          dateOfBirth: '1980-02-01T00:00:00',
          sex: 'Sex',
          specialInstructions: 'Special instructions',
          phoneNumber: '09876543210',
          address1: '1 Primary Street',
          address2: 'Sutton',
          address3: 'London',
          postCode: 'ABC 123',
          orderStartDate: '2012-02-01T00:00:00',
          orderEndDate: '2013-04-03T00:00:00',
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

      page.orderDetails.shouldHaveItem('Order start date', '1 February 2012')
      page.orderDetails.shouldHaveItem('Order end date', '3 April 2013')
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
