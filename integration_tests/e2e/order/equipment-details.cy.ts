import EquipmentDetailsPage from '../../pages/order/equipmentDetails'
import Page from '../../pages/page'

context('Equipment Details', () => {
  const orderId = '1232123'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
  })

  it('is reachable', () => {
    cy.task('stubDatastoreGetEquipmentDetails', {
      httpStatus: 200,
      orderId,
      body: [],
    })

    cy.visit(`/orders/${orderId}/equipment-details`)

    Page.verifyOnPage(EquipmentDetailsPage)
  })

  describe('Timetables', () => {
    it('Renders when no timetable entries have been found', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        orderId,
        body: [],
      })

      cy.visit(`/orders/${orderId}/equipment-details`)

      const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage)
      equipmentDetailsPage.timeline.should('not.be.visible')
    })

    it('Renders when no timetable entries have been found', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        orderId,
        body: [],
      })

      cy.visit(`/orders/${orderId}/equipment-details`)

      const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage)
      equipmentDetailsPage.timeline.should('not.be.visible')
    })

    it('Renders when one timetable entry have been found', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        orderId,
        body: [
          {
            legacySubjectId: 123,
            legacyOrderId: 321,
            pid: {
              id: '123456',
              equipmentCategoryDescription: 'TEST_PID_DESCRIPTION',
              installedDateTime: '2002-02-02T01:01:01',
              removedDateTime: '2002-06-02T01:01:01',
            },
            hmu: {
              id: '098765',
              equipmentCategoryDescription: 'TEST_HMU_DESCRIPTION',
              installedDateTime: '2002-02-02T01:01:01',
              removedDateTime: '2002-06-02T01:01:01',
            },
          },
        ],
      })

      cy.visit(`/orders/${orderId}/equipment-details`)

      const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage)
      equipmentDetailsPage.timeline.should('be.visible')
      equipmentDetailsPage.timelineItems.should('have.length', 1)
      equipmentDetailsPage.getTimelineItem(0).contains('PID or Device ID 123456')
      equipmentDetailsPage.getTimelineItem(0).contains('HMU ID 098765')
    })

    it('Renders when multiple timetable entries have been found', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        orderId,
        body: [
          {
            legacySubjectId: 123,
            legacyOrderId: 321,
            pid: {
              id: '123456',
              equipmentCategoryDescription: 'TEST_PID_DESCRIPTION',
              installedDateTime: '2002-02-02T01:01:01',
              removedDateTime: '2002-06-02T01:01:01',
            },
            hmu: {
              id: '098765',
              equipmentCategoryDescription: 'TEST_HMU_DESCRIPTION',
              installedDateTime: '2002-02-02T01:01:01',
              removedDateTime: '2002-06-02T01:01:01',
            },
          },
          {
            legacySubjectId: 456,
            legacyOrderId: 654,
            pid: {
              id: '012938',
              equipmentCategoryDescription: 'TEST_PID_DESCRIPTION',
              installedDateTime: '2002-02-02T01:01:01',
              removedDateTime: '2002-06-02T01:01:01',
            },
            hmu: {
              id: '657483',
              equipmentCategoryDescription: 'TEST_HMU_DESCRIPTION',
              installedDateTime: '2002-02-02T01:01:01',
              removedDateTime: '2002-06-02T01:01:01',
            },
          },
        ],
      })

      cy.visit(`/orders/${orderId}/equipment-details`)

      const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage)
      equipmentDetailsPage.timeline.should('be.visible')
      equipmentDetailsPage.timelineItems.should('have.length', 2)
      equipmentDetailsPage.getTimelineItem(0).contains('PID or Device ID 123456')
      equipmentDetailsPage.getTimelineItem(0).contains('HMU ID 098765')
      equipmentDetailsPage.getTimelineItem(1).contains('PID or Device ID 012938')
      equipmentDetailsPage.getTimelineItem(1).contains('HMU ID 657483')
    })

    it('Renders empty details when no Device is present', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        orderId,
        body: [
          {
            legacySubjectId: 123,
            legacyOrderId: 321,
            hmu: {
              id: '098765',
              equipmentCategoryDescription: 'TEST_HMU_DESCRIPTION',
              installedDateTime: '2002-02-02T01:01:01',
              removedDateTime: '2002-06-02T01:01:01',
            },
          },
        ],
      })

      cy.visit(`/orders/${orderId}/equipment-details`)

      const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage)
      equipmentDetailsPage.timeline.should('be.visible')
      equipmentDetailsPage.timelineItems.should('have.length', 1)
      equipmentDetailsPage.getTimelineItem(0).contains('PID or Device ID PID equipment category description')
      equipmentDetailsPage.getTimelineItem(0).contains('HMU ID 098765')
    })

    it('Renders empty details when no HMU Device is present', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        orderId,
        body: [
          {
            legacySubjectId: 123,
            legacyOrderId: 321,
            pid: {
              id: '012938',
              equipmentCategoryDescription: 'TEST_PID_DESCRIPTION',
              installedDateTime: '2002-02-02T01:01:01',
              removedDateTime: '2002-06-02T01:01:01',
            },
          },
        ],
      })

      cy.visit(`/orders/${orderId}/equipment-details`)

      const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage)
      equipmentDetailsPage.timeline.should('be.visible')
      equipmentDetailsPage.timelineItems.should('have.length', 1)
      equipmentDetailsPage.getTimelineItem(0).contains('PID or Device ID 012938 PID equipment category description')
      equipmentDetailsPage.getTimelineItem(0).contains('HMU ID HMU equipment category description')
    })
  })
})
