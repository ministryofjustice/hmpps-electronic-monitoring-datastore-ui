import VisitDetailsPage from '../../pages/order/visitDetails'
import Page from '../../pages/page'

context('Visit details', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/visit-details`)
  })

  it('is reachable', () => {
    Page.verifyOnPage(VisitDetailsPage)
  })

  describe('timeline component', () => {
    it('Renders a suspensions timeline', () => {
      const suspensions = Page.verifyOnPage(VisitDetailsPage)
      suspensions.timeline().should('be.visible')
    })
  })

  describe('Visit details timeline item', () => {
    it('First table includes expected column headers', () => {
      const visitDetails = Page.verifyOnPage(VisitDetailsPage)

      visitDetails.timelineItems().each($item => {
        cy.wrap($item).within(() => {
          visitDetails.details().within(() => {
            visitDetails.detailsSummary().click({ force: true })
          })
          visitDetails.firstTable().within(() => {
            visitDetails.visitDetailsTableColumnHeaders('Type').should('be.visible')
            visitDetails.visitDetailsTableColumnHeaders('Details').should('be.visible')
          })
        })
      })
    })
    it('Second table includes expected column headers', () => {
      const visitDetails = Page.verifyOnPage(VisitDetailsPage)

      visitDetails.timelineItems().each($item => {
        cy.wrap($item).within(() => {
          visitDetails.details().within(() => {
            visitDetails.detailsSummary().click({ force: true })
          })
          visitDetails.secondTable().within(() => {
            visitDetails.visitDetailsTableColumnHeaders('Visit Type').should('be.visible')
            visitDetails.visitDetailsTableColumnHeaders('Visit Outcome').should('be.visible')
          })
        })
      })
    })
    it('First table includes expected row headers', () => {
      const visitDetails = Page.verifyOnPage(VisitDetailsPage)
      visitDetails.timelineItems().each($item => {
        cy.wrap($item).within(() => {
          visitDetails.details().within(() => {
            visitDetails.detailsSummary().click({ force: true })
          })
          visitDetails.firstTableBody().within(() => {
            visitDetails.visitDetailsTableRowHeaders('Actual work start date').should('be.visible')
            visitDetails.visitDetailsTableRowHeaders('Actual work start time').should('be.visible')
            visitDetails.visitDetailsTableRowHeaders('Actual work end date').should('be.visible')
            visitDetails.visitDetailsTableRowHeaders('Actual work end time').should('be.visible')
            visitDetails.visitDetailsTableRowHeaders('Visit notes').should('be.visible')
          })
        })
      })
    })
    it('Second table includes expected row headers', () => {
      const visitDetails = Page.verifyOnPage(VisitDetailsPage)
      visitDetails.timelineItems().each($item => {
        cy.wrap($item).within(() => {
          visitDetails.details().within(() => {
            visitDetails.detailsSummary().click({ force: true })
          })
          visitDetails.secondTableBody().within(() => {
            visitDetails.visitDetailsTableRowHeaders('RAM1').should('be.visible')
            visitDetails.visitDetailsTableRowHeaders('Strap Tamper').should('be.visible')
          })
        })
      })
    })
  })
})
