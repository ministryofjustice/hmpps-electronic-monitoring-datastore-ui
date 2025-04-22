import Page from '../../pages/page'
import SuspensionOfVisitsPage from '../../pages/integrity/suspensionOfVisits'

context('Suspensions', () => {
  const legacySubjectId = 1234567
  const suspensionOfVisitEvents = [
    {
      legacySubjectId: 123456789,
      suspensionOfVisits: 'Yes',
      requestedDate: '2001-01-01T01:01:01',
      startDate: '2001-01-01T01:01:01',
      startTime: '01:01:01',
      endDate: '2001-01-01T01:01:01',
    },
    {
      legacySubjectId: 123456789,
      suspensionOfVisits: 'Yes',
      requestedDate: '2002-02-02T02:02:02',
      startDate: '2002-02-02T02:02:02',
      startTime: '02:02:02',
      endDate: '2002-02-02T02:02:02',
    },
    {
      legacySubjectId: 123456789,
      suspensionOfVisits: 'Yes',
      requestedDate: '2003-03-03T03:03:03',
      startDate: '2003-03-03T03:03:03',
      startTime: '03:03:03',
      endDate: '2003-03-03T03:03:03',
    },
  ]
  const expectedEventValues = [
    {
      legacySubjectId: '123456789',
      suspensionOfVisits: 'Yes',
      requestedDate: '1 January 2001',
      startDate: '1 January 2001',
      startTime: '1:01am',
      endDate: '1 January 2001',
    },
    {
      legacySubjectId: '123456789',
      suspensionOfVisits: 'Yes',
      requestedDate: '2 February 2002',
      startDate: '2 February 2002',
      startTime: '2:02am',
      endDate: '2 February 2002',
    },
    {
      legacySubjectId: '123456789',
      suspensionOfVisits: 'Yes',
      requestedDate: '3 March 2003',
      startDate: '3 March 2003',
      startTime: '3:03am',
      endDate: '3 March 2003',
    },
  ]

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.task('stubIntegrityGetSuspensionOfVisits', {
      httpStatus: 200,
      legacySubjectId,
      body: suspensionOfVisitEvents,
    })

    cy.signIn()
  })

  it('Should display the user name visible in header', () => {
    const page = Page.visit(SuspensionOfVisitsPage, { legacySubjectId })
    page.header.userName.should('contain.text', 'M. Tester')
  })

  it('Should display the phase banner in header', () => {
    const page = Page.visit(SuspensionOfVisitsPage, { legacySubjectId })
    page.header.phaseBanner.should('contain.text', 'DEV')
  })

  it('Should display the back link', () => {
    const page = Page.visit(SuspensionOfVisitsPage, { legacySubjectId })

    page.backButton.should('exist')
  })

  it('Should be accessible', () => {
    const page = Page.visit(SuspensionOfVisitsPage, { legacySubjectId })
    page.checkIsAccessible()
  })

  describe('Timeline component', () => {
    it('Renders a suspensions timeline', () => {
      const suspensions = Page.visit(SuspensionOfVisitsPage, { legacySubjectId })
      suspensions.timeline().should('be.visible')
    })

    it('Renders the expected number of suspension of visits events', () => {
      const suspensions = Page.visit(SuspensionOfVisitsPage, { legacySubjectId })
      suspensions.timelineItems().then($items => {
        expect($items.length).to.be.equals(3)
      })
    })
  })

  describe('Timeline events', () => {
    it('Each table includes expected headers', () => {
      const suspensions = Page.visit(SuspensionOfVisitsPage, { legacySubjectId })
      suspensions.timelineItems().each($item => {
        cy.wrap($item).within(() => {
          suspensions.itemTableHeaders('Suspension of visits').should('be.visible')
          suspensions.itemTableHeaders('Suspension of visits requested date').should('be.visible')
          suspensions.itemTableHeaders('Suspension of visits start date').should('be.visible')
          suspensions.itemTableHeaders('Suspension of visits start time').should('be.visible')
          suspensions.itemTableHeaders('Suspension of visits end date').should('be.visible')
        })
      })
    })

    it('Each table includes expected values', () => {
      const suspensions = Page.visit(SuspensionOfVisitsPage, { legacySubjectId })

      suspensions.timelineItems().each(($item, index) => {
        cy.wrap($item).within(() => {
          suspensions
            .itemTableHeaders('Suspension of visits')
            .next('dd')
            .should('contain', expectedEventValues[index].suspensionOfVisits)
          suspensions
            .itemTableHeaders('Suspension of visits requested date')
            .next('dd')
            .should('contain', expectedEventValues[index].requestedDate)
          suspensions
            .itemTableHeaders('Suspension of visits start date')
            .next('dd')
            .should('contain', expectedEventValues[index].startDate)
          suspensions
            .itemTableHeaders('Suspension of visits start time')
            .next('dd')
            .should('contain', expectedEventValues[index].startTime)
          suspensions
            .itemTableHeaders('Suspension of visits end date')
            .next('dd')
            .should('contain', expectedEventValues[index].endDate)
        })
      })
    })
  })
})
