import Page from '../../../pages/page'
import EquipmentDetailsPage from '../../../pages/order/equipmentDetails'

context('Equipment Details', () => {
  const legacySubjectId = '1232123'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })
    cy.signIn()
  })

  it('is reachable', () => {
    cy.task('stubDatastoreGetEquipmentDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    cy.visit(`/integrity/orders/${legacySubjectId}/equipment-details`)
    Page.verifyOnPage(EquipmentDetailsPage)
  })

  describe('No results message', () => {
    it('Renders when no timetable entries have been found', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })

      const equipmentDetailsPage = Page.visit(EquipmentDetailsPage, { legacySubjectId })
      equipmentDetailsPage.noResultsHeading.should('be.visible')
      equipmentDetailsPage.noResultsMessage.should('be.visible')
    })

    it('Does not render when a timetable entry has been found', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        legacySubjectId,
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

      const equipmentDetailsPage = Page.visit(EquipmentDetailsPage, { legacySubjectId })
      equipmentDetailsPage.noResultsHeading.should('not.exist')
      equipmentDetailsPage.noResultsMessage.should('not.exist')
    })
  })

  describe('Timetables', () => {
    it('Does not render when no timetable entries have been found', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })

      const equipmentDetailsPage = Page.visit(EquipmentDetailsPage, { legacySubjectId })
      equipmentDetailsPage.timeline.should('not.exist')
    })

    it('Renders when one timetable entry have been found', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        legacySubjectId,
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

      const equipmentDetailsPage = Page.visit(EquipmentDetailsPage, { legacySubjectId })
      equipmentDetailsPage.timeline.should('be.visible')
      equipmentDetailsPage.timelineItems.should('have.length', 1)
      equipmentDetailsPage.getTimelineItem(0).contains('PID or Device ID 123456')
      equipmentDetailsPage.getTimelineItem(0).contains('HMU ID 098765')
    })

    it('Renders when multiple timetable entries have been found', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        legacySubjectId,
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

      const equipmentDetailsPage = Page.visit(EquipmentDetailsPage, { legacySubjectId })
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
        legacySubjectId,
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

      const equipmentDetailsPage = Page.visit(EquipmentDetailsPage, { legacySubjectId })
      equipmentDetailsPage.timeline.should('be.visible')
      equipmentDetailsPage.timelineItems.should('have.length', 1)
      equipmentDetailsPage.getTimelineItem(0).contains('PID or Device ID PID equipment category description')
      equipmentDetailsPage.getTimelineItem(0).contains('HMU ID 098765')
    })

    it('Renders empty details when no HMU Device is present', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        legacySubjectId,
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

      const equipmentDetailsPage = Page.visit(EquipmentDetailsPage, { legacySubjectId })
      equipmentDetailsPage.timeline.should('be.visible')
      equipmentDetailsPage.timelineItems.should('have.length', 1)
      equipmentDetailsPage.getTimelineItem(0).contains('PID or Device ID 012938 PID equipment category description')
      equipmentDetailsPage.getTimelineItem(0).contains('HMU ID HMU equipment category description')
    })
  })
})
