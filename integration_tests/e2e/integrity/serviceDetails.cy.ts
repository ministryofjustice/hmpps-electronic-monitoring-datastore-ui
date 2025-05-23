import Page from '../../pages/page'
import ServiceDetailsPage from '../../pages/integrity/serviceDetails'

context('Service details', () => {
  const legacySubjectId = '1232123'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })
    cy.signIn()
  })

  it('Should display the user name visible in header', () => {
    cy.task('stubIntegrityGetServiceDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const page = Page.visit(ServiceDetailsPage, { legacySubjectId })
    page.header.userName.should('contain.text', 'M. Tester')
  })

  it('Should display the phase banner in header', () => {
    cy.task('stubIntegrityGetServiceDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const page = Page.visit(ServiceDetailsPage, { legacySubjectId })
    page.header.phaseBanner.should('contain.text', 'DEV')
  })

  it('Should display the back link', () => {
    cy.task('stubIntegrityGetServiceDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const page = Page.visit(ServiceDetailsPage, { legacySubjectId })
    page.backButton.should('exist')
  })

  it('Should be accessible', () => {
    cy.task('stubIntegrityGetServiceDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const page = Page.visit(ServiceDetailsPage, { legacySubjectId })
    page.checkIsAccessible()
  })

  describe('No results message', () => {
    it('Renders when no timetable entries have been found', () => {
      cy.task('stubIntegrityGetServiceDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })

      const serviceDetailsPage = Page.visit(ServiceDetailsPage, { legacySubjectId })
      serviceDetailsPage.noResultsHeading.should('be.visible')
      serviceDetailsPage.noResultsMessage.should('be.visible')
    })

    it('Does not render when a timetable entry has been found', () => {
      cy.task('stubIntegrityGetServiceDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId,
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

      const serviceDetailsPage = Page.visit(ServiceDetailsPage, { legacySubjectId })
      serviceDetailsPage.noResultsHeading.should('not.exist')
      serviceDetailsPage.noResultsMessage.should('not.exist')
    })
  })

  describe('Timetables', () => {
    it('Does not render when no timetable entries have been found', () => {
      cy.task('stubIntegrityGetServiceDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })

      const serviceDetailsPage = Page.visit(ServiceDetailsPage, { legacySubjectId })
      serviceDetailsPage.serviceDetails.should('not.exist')
    })

    it('Renders when one timetable entry has been found', () => {
      cy.task('stubIntegrityGetServiceDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId,
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

      const serviceDetailsPage = Page.visit(ServiceDetailsPage, { legacySubjectId })
      serviceDetailsPage.serviceDetails.should('be.visible')
      serviceDetailsPage.serviceDetails.should('have.length', 1)
      serviceDetailsPage.getServiceDetailsItem(0).contains('Service ID 321')
    })

    it('Renders when multiple timetable entries have been found', () => {
      cy.task('stubIntegrityGetServiceDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId,
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
            legacySubjectId: '456',
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

      const serviceDetailsPage = Page.visit(ServiceDetailsPage, { legacySubjectId })
      serviceDetailsPage.serviceDetails.should('be.visible')
      serviceDetailsPage.serviceDetailsItems.should('have.length', 2)
      serviceDetailsPage.getServiceDetailsItem(0).contains('Service ID 321')
      serviceDetailsPage.getServiceDetailsItem(1).contains('Service ID 654')
    })
  })
})
