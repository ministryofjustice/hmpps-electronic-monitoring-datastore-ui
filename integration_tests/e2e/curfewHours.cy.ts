import CurfewHoursPage from '../pages/curfewHours'
import Page from '../pages/page'

context('Curfew hours', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/curfew-hours`)
  })

  it('is reachable', () => {
    Page.verifyOnPage(CurfewHoursPage)
  })

  describe('Curfew hours table', () => {
    it('Includes expected column headers', () => {
      const curfewHoursPage = Page.verifyOnPage(CurfewHoursPage)

      curfewHoursPage.curfewHoursTable().each(() => {
        curfewHoursPage.curfewHoursColumnHeaders('Data title').should('be.visible')
        curfewHoursPage.curfewHoursColumnHeaders('Data').should('be.visible')
      })
    })

    it('Includes expected row headers', () => {
      const curfewHoursPage = Page.verifyOnPage(CurfewHoursPage)

      curfewHoursPage.curfewHoursTable().each(() => {
        curfewHoursPage.curfewHoursRowHeaders('ServiceStartDate').should('be.visible')
        curfewHoursPage.curfewHoursRowHeaders('ServiceEndDate').should('be.visible')
        curfewHoursPage.curfewHoursRowHeaders('HoursStartDate').should('be.visible')
      })
    })
  })
})
