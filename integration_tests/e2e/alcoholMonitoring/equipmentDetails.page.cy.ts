import Page from '../../pages/page'

import AlcoholMonitoringEquipmentDetailsPage from '../../pages/alcoholMonitoring/equipmentDetails'
import AlcoholMonitoringOrderSummaryPage from '../../pages/alcoholMonitoring/summary'

import { AlcoholMonitoringEquipmentDetails } from '../../../server/models/alcoholMonitoring/equipmentDetails'

context('Alcohol Monitoring equipment details', () => {
  const legacySubjectId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.signIn()
  })

  describe('General page content', () => {
    beforeEach(() => {
      cy.task('stubAlcoholMonitoringGetEquipmentDetails', {
        httpStatus: 200,
        legacySubjectId,
      })
    })

    it('can see their user name', () => {
      const page = Page.visit(AlcoholMonitoringEquipmentDetailsPage, { legacySubjectId })
      page.header.userName.contains('M. Tester')
    })

    it('Can see the phase banner', () => {
      const page = Page.visit(AlcoholMonitoringEquipmentDetailsPage, { legacySubjectId })
      page.header.phaseBanner.contains('DEV')
    })

    it('Can see service information', () => {
      const page = Page.visit(AlcoholMonitoringEquipmentDetailsPage, { legacySubjectId })
      page.serviceInformation.should('exist')
    })

    it('Can go back to the summary page', () => {
      cy.task('stubAlcoholMonitoringGetOrderSummary', {
        httpStatus: 200,
        legacySubjectId,
      })

      const page = Page.visit(AlcoholMonitoringEquipmentDetailsPage, { legacySubjectId })

      page.backButton.click()
      Page.verifyOnPage(AlcoholMonitoringOrderSummaryPage)
    })

    it('Is accessible', () => {
      const page = Page.visit(AlcoholMonitoringEquipmentDetailsPage, { legacySubjectId })
      page.checkIsAccessible()
    })
  })

  describe('Timeline of visit details', () => {
    it('Renders a timeline', () => {
      cy.task('stubAlcoholMonitoringGetEquipmentDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR123',
            deviceType: 'tag',
            deviceSerialNumber: '740',
            deviceAddressType: 'secondary',
            legFitting: 'right',
            deviceInstalledDateTime: '2001-01-01T01:10:10',
            deviceRemovedDateTime: '2002-02-02T02:20:20',
            hmuInstallDateTime: '2001-01-01T01:10:10',
            hmuRemovedDateTime: '2002-02-02T02:20:20',
          } as AlcoholMonitoringEquipmentDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringEquipmentDetailsPage, { legacySubjectId })
      page.timeline.shouldBeVisible()
    })

    it('First item includes expected details', () => {
      cy.task('stubAlcoholMonitoringGetEquipmentDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            deviceType: 'tag',
            deviceSerialNumber: '740',
            deviceAddressType: 'secondary',
            legFitting: 'right',
            deviceInstalledDateTime: '2001-01-01T01:10:10',
            deviceRemovedDateTime: '2002-02-02T02:20:20',
            hmuInstallDateTime: '2001-01-01T01:10:10',
            hmuRemovedDateTime: '2002-02-02T02:20:20',
          } as AlcoholMonitoringEquipmentDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringEquipmentDetailsPage, { legacySubjectId })

      page.timeline.shouldHaveCount(1)

      page.timeline.item(0).shouldHaveTitle('Equipment details')
      page.timeline.item(0).shouldHaveDate('1 Jan 2001 at 1:10am')

      page.timeline.item(0).description.shouldHaveItem('Device type', 'tag')
      page.timeline.item(0).description.shouldHaveItem('Device serial number', '740')
      page.timeline.item(0).description.shouldHaveItem('Device address type', 'secondary')
      page.timeline.item(0).description.shouldHaveItem('Leg fitting', 'right')
      page.timeline.item(0).description.shouldHaveItem('Device installed date time', '1 January 2001 at 1:10am')
      page.timeline.item(0).description.shouldHaveItem('Device removed date time', '2 February 2002 at 2:20am')
      page.timeline.item(0).description.shouldHaveItem('HMU install date time', '1 January 2001 at 1:10am')
      page.timeline.item(0).description.shouldHaveItem('HMU removed date time', '2 February 2002 at 2:20am')
    })

    it('Second item includes expected details', () => {
      cy.task('stubAlcoholMonitoringGetEquipmentDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            deviceType: 'tag',
            deviceSerialNumber: '740',
            deviceAddressType: 'secondary',
            legFitting: 'right',
            deviceInstalledDateTime: '2001-01-01T01:10:10',
            deviceRemovedDateTime: '2002-02-02T02:20:20',
            hmuInstallDateTime: '2001-01-01T01:10:10',
            hmuRemovedDateTime: '2002-02-02T02:20:20',
          } as AlcoholMonitoringEquipmentDetails,
          {
            legacySubjectId: 'AAMR321',
            deviceType: 'tag',
            deviceSerialNumber: '760',
            deviceAddressType: 'tertiary',
            legFitting: 'left',
            deviceInstalledDateTime: '2001-01-02T01:10:10',
            deviceRemovedDateTime: '2002-02-03T02:20:20',
            hmuInstallDateTime: '2001-01-02T01:10:10',
            hmuRemovedDateTime: '2002-02-03T02:20:20',
          } as AlcoholMonitoringEquipmentDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringEquipmentDetailsPage, { legacySubjectId })

      page.timeline.shouldHaveCount(2)

      page.timeline.item(1).shouldHaveTitle('Equipment details')
      page.timeline.item(1).shouldHaveDate('2 Jan 2001 at 1:10am')

      page.timeline.item(1).description.shouldHaveItem('Device type', 'tag')
      page.timeline.item(1).description.shouldHaveItem('Device serial number', '760')
      page.timeline.item(1).description.shouldHaveItem('Device address type', 'tertiary')
      page.timeline.item(1).description.shouldHaveItem('Leg fitting', 'left')
      page.timeline.item(1).description.shouldHaveItem('Device installed date time', '2 January 2001 at 1:10am')
      page.timeline.item(1).description.shouldHaveItem('Device removed date time', '3 February 2002 at 2:20am')
      page.timeline.item(1).description.shouldHaveItem('HMU install date time', '2 January 2001 at 1:10am')
      page.timeline.item(1).description.shouldHaveItem('HMU removed date time', '3 February 2002 at 2:20am')
    })

    it('Details can be empty and still display', () => {
      cy.task('stubAlcoholMonitoringGetEquipmentDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            deviceType: null,
            deviceSerialNumber: null,
            deviceAddressType: null,
            legFitting: null,
            deviceInstalledDateTime: null,
            deviceRemovedDateTime: null,
            hmuInstallDateTime: null,
            hmuRemovedDateTime: null,
          } as AlcoholMonitoringEquipmentDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringEquipmentDetailsPage, { legacySubjectId })

      page.timeline.shouldHaveCount(1)
      page.timeline.item(0).shouldBeVisible()
    })
  })
})
