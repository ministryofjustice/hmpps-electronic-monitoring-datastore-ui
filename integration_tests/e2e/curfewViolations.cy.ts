import CurfewViolationsPage from '../pages/curfewViolations'
import Page from '../pages/page'

context('Curfew violations', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/curfew-violations`)
  })

  it('is reachable', () => {
    Page.verifyOnPage(CurfewViolationsPage)
  })

  describe('Timeline component', () => {
    it('Renders an event timeline', () => {
      const curfewViolations = Page.verifyOnPage(CurfewViolationsPage)
      curfewViolations.timeline().should('be.visible')
    })
  })

  describe('Violations timeline item', () => {
    it('Includes expected column headers', () => {
      const curfewViolations = Page.verifyOnPage(CurfewViolationsPage)

      curfewViolations.timelineItems().each($item => {
        cy.wrap($item).within(() => {
          curfewViolations.violationsTableColumnHeaders('Data title').should('be.visible')
          curfewViolations.violationsTableColumnHeaders('Data').should('be.visible')
        })
      })
    })

    it('Includes expected row headers', () => {
      const curfewViolations = Page.verifyOnPage(CurfewViolationsPage)
      curfewViolations.timelineItems().each($item => {
        cy.wrap($item).within(() => {
          curfewViolations.violationsTableRowHeaders('EnforcementReason').should('be.visible')
          curfewViolations.violationsTableRowHeaders('InvestigationOutcomeReason').should('be.visible')
          // Add row headers here when finalised.
        })
      })
    })
  })
})
