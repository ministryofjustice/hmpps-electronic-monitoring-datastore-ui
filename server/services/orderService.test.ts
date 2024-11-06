import OrderService from './orderService'
import orderInformation from '../data/mockData/orderInformation'

describe('Order service', () => {
  let orderService: OrderService

  beforeEach(() => {
    orderService = new OrderService()
  })

  describe('getOrderInformation', () => {
    it('returns expected order', async () => {
      const expectedData = orderInformation
      const results = await orderService.getOrderInformation()
      expect(results).toBe(expectedData)
    })
  })
})
