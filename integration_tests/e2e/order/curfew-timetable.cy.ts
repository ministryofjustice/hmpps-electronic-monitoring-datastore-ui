import CurfewTimetablePage from '../../pages/order/curfewTimetable'
import Page from '../../pages/page'

context('Crufew Timetable', () => {
  const orderId = '1232123'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
  })

  it('is reachable', () => {
    cy.task('stubDatastoreGetCurfewTimetable', {
      httpStatus: 200,
      orderId,
      body: [],
    })

    cy.visit(`/orders/${orderId}/curfew-timetable`)

    Page.verifyOnPage(CurfewTimetablePage)
  })

  describe('No results message', () => {
    it('Renders when no timetable entries have been found', () => {
      cy.task('stubDatastoreGetCurfewTimetable', {
        httpStatus: 200,
        orderId,
        body: [],
      })

      cy.visit(`/orders/${orderId}/curfew-timetable`)

      const curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      curfewTimetablePage.noResultsHeading.should('be.visible')
      curfewTimetablePage.noResultsMessage.should('be.visible')
    })

    it('Does not render when a timetable entry has been found', () => {
      cy.task('stubDatastoreGetCurfewTimetable', {
        httpStatus: 200,
        orderId,
        body: [
          {
            legacySubjectId: 123,
            serviceId: 321,
            serviceAddress1: 'address line 1',
            serviceAddress2: 'address line 2',
            serviceAddress3: 'address line 3',
            serviceAddressPostcode: 'postcode',
            serviceStartDate: '2002-05-22T01:01:01',
            serviceEndDate: '2002-05-22T01:01:01',
            curfewStartDate: '2002-05-22T01:01:01',
            curfewEndDate: '2002-05-22T01:01:01',
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 7,
          },
        ],
      })

      cy.visit(`/orders/${orderId}/curfew-timetable`)

      const curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      curfewTimetablePage.noResultsHeading.should('not.exist')
      curfewTimetablePage.noResultsMessage.should('not.exist')
    })
  })

  describe('Timetables', () => {
    it('Does not render when no timetable entries have been found', () => {
      cy.task('stubDatastoreGetCurfewTimetable', {
        httpStatus: 200,
        orderId,
        body: [],
      })

      cy.visit(`/orders/${orderId}/curfew-timetable`)

      const curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      curfewTimetablePage.curfewTimetable.should('not.exist')
    })

    it('Renders when one timetable entry has been found', () => {
      cy.task('stubDatastoreGetCurfewTimetable', {
        httpStatus: 200,
        orderId,
        body: [
          {
            legacySubjectId: 123,
            serviceId: 321,
            serviceAddress1: 'address line 1',
            serviceAddress2: 'address line 2',
            serviceAddress3: 'address line 3',
            serviceAddressPostcode: 'postcode',
            serviceStartDate: '2002-05-22T01:01:01',
            serviceEndDate: '2002-05-22T01:01:01',
            curfewStartDate: '2002-05-22T01:01:01',
            curfewEndDate: '2002-05-22T01:01:01',
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 7,
          },
        ],
      })

      cy.visit(`/orders/${orderId}/curfew-timetable`)

      const curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      curfewTimetablePage.curfewTimetable.should('be.visible')
      curfewTimetablePage.curfewTimetableItems.should('have.length', 1)
      curfewTimetablePage.getCurfewTimetableItem(0).contains('Service ID 321')
    })

    it('Renders when multiple timetable entries have been found', () => {
      cy.task('stubDatastoreGetCurfewTimetable', {
        httpStatus: 200,
        orderId,
        body: [
          {
            legacySubjectId: 123,
            serviceId: 321,
            serviceAddress1: 'address line 1',
            serviceAddress2: 'address line 2',
            serviceAddress3: 'address line 3',
            serviceAddressPostcode: 'postcode',
            serviceStartDate: '2002-05-22T01:01:01',
            serviceEndDate: '2002-05-22T01:01:01',
            curfewStartDate: '2002-05-22T01:01:01',
            curfewEndDate: '2002-05-22T01:01:01',
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 7,
          },
          {
            legacySubjectId: 456,
            serviceId: 654,
            serviceAddress1: 'address line 1',
            serviceAddress2: 'address line 2',
            serviceAddress3: 'address line 3',
            serviceAddressPostcode: 'postcode',
            serviceStartDate: '2002-05-22T01:01:01',
            serviceEndDate: '2002-05-22T01:01:01',
            curfewStartDate: '2002-05-22T01:01:01',
            curfewEndDate: '2002-05-22T01:01:01',
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 7,
          },
        ],
      })

      cy.visit(`/orders/${orderId}/curfew-timetable`)

      const curfewTimetablePage = Page.verifyOnPage(CurfewTimetablePage)
      curfewTimetablePage.curfewTimetable.should('be.visible')
      curfewTimetablePage.curfewTimetableItems.should('have.length', 2)
      curfewTimetablePage.getCurfewTimetableItem(0).contains('Service ID 321')
      curfewTimetablePage.getCurfewTimetableItem(1).contains('Service ID 654')
    })
  })
})
