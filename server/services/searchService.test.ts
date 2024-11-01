// import SearchService from './searchService'
// import orders from '../data/mockData/orders'
// import HmppsAuthClient from '../data/hmppsAuthClient'

// jest.mock('../data/hmppsAuthClient')

// describe('Search service', () => {
//   let mockAuthClient: jest.Mocked<HmppsAuthClient>
//   let searchService: SearchService

//   beforeEach(() => {
//     // mockAuthClient = new HmppsAuthClient(
//     //   'datastoreApi',
//     //   {
//     //     url: '',
//     //     timeout: { response: 0, deadline: 0 },
//     //     agent: { timeout: 0 },
//     //   },
//     //   '123') as jest.Mocked<HmppsAuthClient>

//     searchService = new SearchService(mockAuthClient)
//   })

//   describe('getOrders', () => {
//     it('returns true', async () => {
//       const expectedData = orders
//       const results = await searchService.getOrders()
//       expect(results).toBe(expectedData)
//     })
//   })
// })
