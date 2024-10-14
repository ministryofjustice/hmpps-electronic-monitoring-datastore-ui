import OrderService from './orderService'
import { OrderSummary } from '../interfaces/orderSummary'
import orderSummary from '../data/mockData/orderSummary'

describe('Order service', () => {
  let orderService: OrderService

  beforeEach(() => {
    orderService = new OrderService()
  })

  describe('getOrderSummary', () => {
    it('returns expected order', async () => {
      const expectedData = orderSummary
      const results = await orderService.getOrderSummary()
      expect(results).toBe(orderSummary)
    })
  })
})
