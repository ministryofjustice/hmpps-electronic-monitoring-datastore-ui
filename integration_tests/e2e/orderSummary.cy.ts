import OrderSummaryPage from '../pages/orderSummary'
import Page, { PageElement } from '../pages/page'

context('Order Summary', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/summary`)
  })

  it('is reachable', () => {
    Page.verifyOnPage(OrderSummaryPage)
  })

  describe('Order summary table', () => {
    it('contains expected rows', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.orderDetailsTable().each(() => {
        summaryPage.legacySubjectId().should('be.visible')
        summaryPage.name().should('be.visible')
        summaryPage.alias().should('be.visible')
        summaryPage.dateOfBirth().should('be.visible')
        summaryPage.postcode().should('be.visible')
        summaryPage.tagType().should('be.visible')
        summaryPage.startDate().should('be.visible')
        summaryPage.endDate().should('be.visible')
      })
    })
  })

  describe('Grid buttons', () => {
    it('contains button order details button and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.orderDetailsButton().should('be.visible')
      summaryPage.orderDetailsButton().click()
      cy.url().should('include', `/orders/${orderId}/details`)
    })

    it('contains button visits and tasks and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.visitsAndTasksButton().should('be.visible')
      summaryPage.visitsAndTasksButton().click()
      cy.url().should('include', `/orders/${orderId}/visits-and-tasks`)
    })

    it('contains button event history and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.eventHistoryButton().should('be.visible')
      summaryPage.eventHistoryButton().click()
      cy.url().should('include', `/orders/${orderId}/event-history`)
    })

    it('contains button equipment details and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.equipmentDetailsButton().should('be.visible')
      summaryPage.equipmentDetailsButton().click()
      cy.url().should('include', `/orders/${orderId}/equipment-details`)
    })

    it('contains button curfew hours and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.curfewHoursButton().should('be.visible')
      summaryPage.curfewHoursButton().click()
      cy.url().should('include', `/orders/${orderId}/curfew-hours`)
    })

    it('contains button curfew violations and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.curfewViolationsButton().should('be.visible')
      summaryPage.curfewViolationsButton().click()
      cy.url().should('include', `/orders/${orderId}/curfew-violations`)
    })

    it('contains button contact history and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.contactHistoryButton().should('be.visible')
      summaryPage.contactHistoryButton().click()
      cy.url().should('include', `/orders/${orderId}/contact-history`)
    })

    it('contains button suspensions and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.suspensionsButton().should('be.visible')
      summaryPage.suspensionsButton().click()
      cy.url().should('include', `/orders/${orderId}/suspensions`)
    })
  })

  describe('Date filter', () => {
    it('renders the clear filter component after clicking apply', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      // Locate the dateFilter container
      summaryPage.dateFilter().within(() => {
        // From date
        summaryPage.dateFilterRow().find('#start-date-day').type('01')
        summaryPage.dateFilterRow().find('#start-date-month').type('10')
        summaryPage.dateFilterRow().find('#start-date-year').type('2023')

        // To date
        summaryPage.dateFilterRow().find('#end-date-day').type('15')
        summaryPage.dateFilterRow().find('#end-date-month').type('10')
        summaryPage.dateFilterRow().find('#end-date-year').type('2023')

        // Click the apply button
        summaryPage.applyButton().click()

        // Verify that the 'x clear filter' link is rendered after clicking apply
        summaryPage.clearFilterLink().should('be.visible').and('contain.text', 'x clear filter')
      })
    })
  })

  describe('Document tabs', () => {
    it('Contains expected tabs', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.tabsList().within(() => {
        summaryPage.orderDocumentsTab().should('be.visible')
        summaryPage.variationsTab().should('be.visible')
        summaryPage.enforcementsTab().should('be.visible')
        summaryPage.visitReportsTab().should('be.visible')
      })
    })
  })

  describe('Document tabs display content', () => {
    it('Displays the correct panel when the Order Documents tab is clicked', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)

      summaryPage.tabsList().within(() => {
        summaryPage.orderDocumentsTab().click()
      })

      summaryPage.orderDocumentsPanel().should('be.visible')
      summaryPage.variationsPanel().should('not.be.visible')
    })

    it('Displays the correct panel when the Variations tab is clicked', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)

      summaryPage.tabsList().within(() => {
        summaryPage.variationsTab().click()
      })

      summaryPage.variationsPanel().should('be.visible')
      summaryPage.orderDocumentsPanel().should('not.be.visible')
    })
  })
})
