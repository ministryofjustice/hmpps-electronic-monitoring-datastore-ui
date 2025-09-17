import Page from '../../pages/page'

import AlcoholMonitoringServiceDetailsPage from '../../pages/alcoholMonitoring/serviceDetails'
import AlcoholMonitoringOrderSummaryPage from '../../pages/alcoholMonitoring/summary'

import { AlcoholMonitoringServiceDetails } from '../../../server/data/models/alcoholMonitoringServiceDetails'

context('Alcohol Monitoring service details', () => {
  const legacySubjectId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.signIn()
  })

  describe('General page content', () => {
    beforeEach(() => {
      cy.task('stubAlcoholMonitoringGetServiceDetails', {
        httpStatus: 200,
        legacySubjectId,
      })
    })

    it('can see their user name', () => {
      const page = Page.visit(AlcoholMonitoringServiceDetailsPage, { legacySubjectId })
      page.header.userName.contains('M. Tester')
    })

    it('Can see the phase banner', () => {
      const page = Page.visit(AlcoholMonitoringServiceDetailsPage, { legacySubjectId })
      page.header.phaseBanner.contains('DEV')
    })

    it('Can see service information', () => {
      const page = Page.visit(AlcoholMonitoringServiceDetailsPage, { legacySubjectId })
      page.serviceInformation.should('exist')
    })

    it('Can go back to the summary page', () => {
      cy.task('stubAlcoholMonitoringGetOrderDetails', {
        httpStatus: 200,
        legacySubjectId,
      })

      const page = Page.visit(AlcoholMonitoringServiceDetailsPage, { legacySubjectId })

      page.backButton.click()
      Page.verifyOnPage(AlcoholMonitoringOrderSummaryPage)
    })

    it('Is accessible', () => {
      const page = Page.visit(AlcoholMonitoringServiceDetailsPage, { legacySubjectId })
      page.checkIsAccessible()
    })
  })

  describe('Timeline of visit details', () => {
    it('Renders a timeline', () => {
      cy.task('stubAlcoholMonitoringGetServiceDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR123',
            serviceStartDate: '2001-01-01T00:00:00',
            serviceEndDate: '2002-02-02T00:00:00',
            serviceAddress: 'service address',
            equipmentStartDate: '2003-03-03T00:00:00',
            equipmentEndDate: '2004-04-04T00:00:00',
            hmuSerialNumber: 'hmu-01',
            deviceSerialNumber: 'device-01',
          } as AlcoholMonitoringServiceDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringServiceDetailsPage, { legacySubjectId })
      page.timeline.shouldBeVisible()
    })

    it('First item includes expected details', () => {
      cy.task('stubAlcoholMonitoringGetServiceDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            serviceStartDate: '2001-01-01T00:00:00',
            serviceEndDate: '2002-02-02T00:00:00',
            serviceAddress: 'service address',
            equipmentStartDate: '2003-03-03T00:00:00',
            equipmentEndDate: '2004-04-04T00:00:00',
            hmuSerialNumber: 'hmu-02',
            deviceSerialNumber: 'device-02',
          } as AlcoholMonitoringServiceDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringServiceDetailsPage, { legacySubjectId })

      page.timeline.shouldHaveCount(1)

      page.timeline.item(0).shouldHaveTitle('Service')
      page.timeline.item(0).shouldHaveDate('1 Jan 2001 at 12am')

      page.timeline.item(0).description.shouldHaveItem('Service start date', '1 January 2001')
      page.timeline.item(0).description.shouldHaveItem('Service end date', '2 February 2002')
      page.timeline.item(0).description.shouldHaveItem('Service address', 'service address')
      page.timeline.item(0).description.shouldHaveItem('Equipment start date', '3 March 2003')
      page.timeline.item(0).description.shouldHaveItem('Equipment end date', '4 April 2004')
      page.timeline.item(0).description.shouldHaveItem('HMU serial number', 'hmu-02')
      page.timeline.item(0).description.shouldHaveItem('Device serial number', 'device-02')
    })

    it('Second item includes expected details', () => {
      cy.task('stubAlcoholMonitoringGetServiceDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            serviceStartDate: '2001-01-01T00:00:00',
            serviceEndDate: '2002-02-02T00:00:00',
            serviceAddress: 'service address',
            equipmentStartDate: '2003-03-03T00:00:00',
            equipmentEndDate: '2004-04-04T00:00:00',
            hmuSerialNumber: 'hmu-03',
            deviceSerialNumber: 'device-03',
          } as AlcoholMonitoringServiceDetails,
          {
            legacySubjectId: 'AAMR321',
            serviceStartDate: '2001-01-02T00:00:00',
            serviceEndDate: '2002-02-03T00:00:00',
            serviceAddress: 'service address',
            equipmentStartDate: '2003-03-04T00:00:00',
            equipmentEndDate: '2004-04-05T00:00:00',
            hmuSerialNumber: 'hmu-04',
            deviceSerialNumber: 'device-04',
          } as AlcoholMonitoringServiceDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringServiceDetailsPage, { legacySubjectId })

      page.timeline.shouldHaveCount(2)

      page.timeline.item(1).shouldHaveTitle('Service')
      page.timeline.item(1).shouldHaveDate('2 Jan 2001 at 12am')

      page.timeline.item(1).description.shouldHaveItem('Service start date', '2 January 2001')
      page.timeline.item(1).description.shouldHaveItem('Service end date', '3 February 2002')
      page.timeline.item(1).description.shouldHaveItem('Service address', 'service address')
      page.timeline.item(1).description.shouldHaveItem('Equipment start date', '4 March 2003')
      page.timeline.item(1).description.shouldHaveItem('Equipment end date', '5 April 2004')
      page.timeline.item(1).description.shouldHaveItem('HMU serial number', 'hmu-04')
      page.timeline.item(1).description.shouldHaveItem('Device serial number', 'device-04')
    })

    it('Details can be empty and still display', () => {
      cy.task('stubAlcoholMonitoringGetServiceDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            serviceStartDate: null,
            serviceEndDate: null,
            serviceAddress: null,
            equipmentStartDate: null,
            equipmentEndDate: null,
            hmuSerialNumber: null,
            deviceSerialNumber: null,
          } as AlcoholMonitoringServiceDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringServiceDetailsPage, { legacySubjectId })

      page.timeline.item(0).shouldBeVisible()
    })
  })
})
