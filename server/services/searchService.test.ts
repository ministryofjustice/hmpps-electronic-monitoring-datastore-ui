import SearchService from './searchService'
import { Order } from '../interfaces/order'
import orders from '../data/mockData/orders'

describe('Search service', () => {
  let searchService: SearchService

  beforeEach(() => {
    searchService = new SearchService()
  })

  describe('getOrders', () => {
    it('returns true', async () => {
      const expectedData = orders
      const results = await searchService.getOrders()
      expect(results).toBe(orders)
    })
  })
})
