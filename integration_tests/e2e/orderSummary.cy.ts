import OrderSummaryPage from '../pages/orderSummary'
import Page from '../pages/page'

context('Order Summary', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit('/orders/summary')
  })

  it('is reachable', () => {
    Page.verifyOnPage(OrderSummaryPage)
  })

  describe('Order summary table', () => {
    it('contains row Legacy subject ID', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.legacySubjectId().should('be.visible')
    })

    it('contains row name', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.name().should('be.visible')
    })

    it('contains row alias', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.alias().should('be.visible')
    })

    it('contains row date of birth', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.dateOfBirth().should('be.visible')
    })

    it('contains row postcode', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.postcode().should('be.visible')
    })

    it('contains row address', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.address().should('be.visible')
    })

    it('contains row tag type', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.tagType().should('be.visible')
    })

    it('contains row end date', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.endDate().should('be.visible')
    })
  })

  describe('Grid buttons', () => {
    it('contains button order details button an navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.orderDetailsButton().should('be.visible')
      summaryPage.orderDetailsButton().click()
      cy.url().should('include', '/orders/details')
    })

    it('contains button visits and tasks', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.visitsAndTasksButton().should('be.visible')
      summaryPage.visitsAndTasksButton().click()
      cy.url().should('include', '/orders/visits-and-tasks')
    })

    it('contains button event history', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.eventHistoryButton().should('be.visible')
      summaryPage.eventHistoryButton().click()
      cy.url().should('include', '/orders/event-history')
    })

    it('contains button equipment details', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.equipmentDetailsButton().should('be.visible')
      summaryPage.equipmentDetailsButton().click()
      cy.url().should('include', '/orders/equipment-details')
    })

    it('contains button curfew hours', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.curfewHoursButton().should('be.visible')
      summaryPage.curfewHoursButton().click()
      cy.url().should('include', '/orders/curfew-hours')
    })

    it('contains button curfew violations', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.curfewViolationsButton().should('be.visible')
      summaryPage.curfewViolationsButton().click()
      cy.url().should('include', '/orders/curfew-violations')
    })

    it('contains button contact history', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.contactHistoryButton().should('be.visible')
      summaryPage.contactHistoryButton().click()
      cy.url().should('include', '/orders/contact-history')
    })

    it('contains button suspensions', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.suspensionsButton().should('be.visible')
      summaryPage.suspensionsButton().click()
      cy.url().should('include', '/orders/suspensions')
    })
  })
})
