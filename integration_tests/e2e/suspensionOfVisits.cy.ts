import SuspensionOfVisitsPage from '../pages/suspensionOfVisits'
import Page from '../pages/page'

context('Suspensions', () => {
  const orderId = 1234567
  const events = [
    {
      legacySubjectId: 123456789,
      suspensionOfVisits: 'Yes',
      suspensionOfVisitsRequestedDate: '2001-01-01T01:01:01',
      suspensionOfVisitsStartDate: '2001-01-01T01:01:01',
      suspensionOfVisitsStartTime: '01:01:01',
      suspensionOfVisitsEndDate: '2001-01-01T01:01:01',
    },
    {
      legacySubjectId: 123456789,
      suspensionOfVisits: 'Yes',
      suspensionOfVisitsRequestedDate: '2002-02-02T02:02:02',
      suspensionOfVisitsStartDate: '2002-02-02T02:02:02',
      suspensionOfVisitsStartTime: '02:02:02',
      suspensionOfVisitsEndDate: '2002-02-02T02:02:02',
    },
    {
      legacySubjectId: 123456789,
      suspensionOfVisits: 'Yes',
      suspensionOfVisitsRequestedDate: '2003-03-03T03:03:03',
      suspensionOfVisitsStartDate: '2003-03-03T03:03:03',
      suspensionOfVisitsStartTime: '03:03:03',
      suspensionOfVisitsEndDate: '2003-03-03T03:03:03',
    },
  ]
  const expectedEventValues = [
    {
      legacySubjectId: '123456789',
      suspensionOfVisits: 'Yes',
      suspensionOfVisitsRequestedDate: '01/01/2001',
      suspensionOfVisitsStartDate: '01/01/2001',
      suspensionOfVisitsStartTime: '0101',
      suspensionOfVisitsEndDate: '01/01/2001',
    },
    {
      legacySubjectId: '123456789',
      suspensionOfVisits: 'Yes',
      suspensionOfVisitsRequestedDate: '02/02/2002',
      suspensionOfVisitsStartDate: '02/02/2002',
      suspensionOfVisitsStartTime: '0202',
      suspensionOfVisitsEndDate: '02/02/2002',
    },
    {
      legacySubjectId: '123456789',
      suspensionOfVisits: 'Yes',
      suspensionOfVisitsRequestedDate: '03/03/2003',
      suspensionOfVisitsStartDate: '03/03/2003',
      suspensionOfVisitsStartTime: '0303',
      suspensionOfVisitsEndDate: '03/03/2003',
    },
  ]

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')

    cy.task('stubDatastoreGetSuspensionOfVisits', {
      httpStatus: 200,
      orderId,
      events,
    })

    cy.signIn()
    cy.visit(`/orders/${orderId}/suspension-of-visits`)
  })

  it('is reachable', () => {
    Page.verifyOnPage(SuspensionOfVisitsPage)
  })

  describe('Timeline component', () => {
    it('Renders a suspensions timeline', () => {
      const suspensions = Page.verifyOnPage(SuspensionOfVisitsPage)
      suspensions.timeline().should('be.visible')
    })

    it('Renders the expected number of suspension of visits events', () => {
      const suspensions = Page.verifyOnPage(SuspensionOfVisitsPage)
      suspensions.timelineItems().then($items => {
        expect($items.length).to.be.equals(3)
      })
    })
  })

  describe('Timeline events', () => {
    it('Each table includes expected headers', () => {
      const suspensions = Page.verifyOnPage(SuspensionOfVisitsPage)
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
      const suspensions = Page.verifyOnPage(SuspensionOfVisitsPage)

      suspensions.timelineItems().each(($item, index) => {
        cy.wrap($item).within(() => {
          suspensions
            .itemTableHeaders('Suspension of visits')
            .next('dd')
            .should('contain', expectedEventValues[index].suspensionOfVisits)
          suspensions
            .itemTableHeaders('Suspension of visits requested date')
            .next('dd')
            .should('contain', expectedEventValues[index].suspensionOfVisitsRequestedDate)
          suspensions
            .itemTableHeaders('Suspension of visits start date')
            .next('dd')
            .should('contain', expectedEventValues[index].suspensionOfVisitsStartDate)
          suspensions
            .itemTableHeaders('Suspension of visits start time')
            .next('dd')
            .should('contain', expectedEventValues[index].suspensionOfVisitsStartTime)
          suspensions
            .itemTableHeaders('Suspension of visits end date')
            .next('dd')
            .should('contain', expectedEventValues[index].suspensionOfVisitsEndDate)
        })
      })
    })
  })

  // TODO: Add tests for date filter.
})
