import EquipmentDetailsPage from '../pages/equipmentDetails'
import Page from '../pages/page'

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

  describe('Equipment details HMU table', () => {
    it('Includes expected column caption', () => {
      const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage)

      equipmentDetailsPage.hmuTable().each(() => {
        equipmentDetailsPage.hmuTableCaption('HMU').should('be.visible')
      })
    })

    it('Includes expected row headers', () => {
      const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage)

      equipmentDetailsPage.hmuTable().each(() => {
        equipmentDetailsPage.hmuRowHeaders('HMU ID').should('be.visible')
        equipmentDetailsPage.hmuRowHeaders('HMU Equipment Category Description').should('be.visible')
        equipmentDetailsPage.hmuRowHeaders('HMU Install Date').should('be.visible')
        equipmentDetailsPage.hmuRowHeaders('HMU Install Time').should('be.visible')
        equipmentDetailsPage.hmuRowHeaders('HMU Uninstall Date').should('be.visible')
        equipmentDetailsPage.hmuRowHeaders('HMU Uninstall Time').should('be.visible')
      })
    })
  })

  describe('Equipment details Device table', () => {
    it('Includes expected column caption', () => {
      const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage)

      equipmentDetailsPage.deviceTable().each(() => {
        equipmentDetailsPage.deviceTableCaption('Device').should('be.visible')
      })
    })

    it('Includes expected row headers', () => {
      const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage)

      equipmentDetailsPage.hmuTable().each(() => {
        equipmentDetailsPage.deviceRowHeaders('PID or Device ID').should('be.visible')
        equipmentDetailsPage.deviceRowHeaders('PID Equipment Category Description').should('be.visible')
        equipmentDetailsPage.deviceRowHeaders('Date PID or Device Installed').should('be.visible')
        equipmentDetailsPage.deviceRowHeaders('Time PID or Device Installed').should('be.visible')
        equipmentDetailsPage.deviceRowHeaders('Date PID or Device Installed').should('be.visible')
        equipmentDetailsPage.deviceRowHeaders('Time PID or Device Uninstalled').should('be.visible')
      })
    })
  })
})
