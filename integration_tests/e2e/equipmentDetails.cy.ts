import EquipmentDetailsPage from '../pages/equipmentDetails'
import Page, { PageElement } from '../pages/page'

context('Equipment Details', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/equipment-details`)
  })

  it('is reachable', () => {
    Page.verifyOnPage(EquipmentDetailsPage)
  })

  describe('Equipment details table', () => {
    it('Includes expected column headers', () => {
      const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage)

      equipmentDetailsPage.equipmentDetailsTable().each(() => {
        equipmentDetailsPage.equipmentDetailsColumnHeaders('Data title').should('be.visible')
        equipmentDetailsPage.equipmentDetailsColumnHeaders('Data').should('be.visible')
      })
    })

    it('Includes expected row headers', () => {
      const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage)

      equipmentDetailsPage.equipmentDetailsTable().each(() => {
        equipmentDetailsPage.equipmentDetailsRowHeaders('PIDStartDate').should('be.visible')
        equipmentDetailsPage.equipmentDetailsRowHeaders('PIDEndDate').should('be.visible')
        equipmentDetailsPage.equipmentDetailsRowHeaders('EquipmentCategoryDescription').should('be.visible')
        equipmentDetailsPage.equipmentDetailsRowHeaders('HMUStartDate').should('be.visible')
      })
    })
  })
})
