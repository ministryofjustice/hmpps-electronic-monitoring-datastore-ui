import VisitDetailsPage from '../pages/visitDetails'
import Page from '../pages/page'

context('Visits ans tasks', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/visits-and-tasks`)
  })

  it('is reachable', () => {
    Page.verifyOnPage(VisitDetailsPage)
  })

  describe('Visits and tasks table', () => {
    it('contains expected header names', () => {
      const visitsAndTasksPage = Page.verifyOnPage(VisitDetailsPage)
      visitsAndTasksPage.visitsAndTasksTable().within(() => {
        visitsAndTasksPage.columnHeader('Data title').should('be.visible')
        visitsAndTasksPage.columnHeader('Data').should('be.visible')
      })
    })
    it('contains expected row names', () => {
      const visitsAndTasksPage = Page.verifyOnPage(VisitDetailsPage)
      visitsAndTasksPage.visitsAndTasksTable().within(() => {
        visitsAndTasksPage.rowHeader('crewOnDateSID').should('be.visible')
        visitsAndTasksPage.rowHeader('crewOnTimeSID').should('be.visible')
      })
    })
  })
})
