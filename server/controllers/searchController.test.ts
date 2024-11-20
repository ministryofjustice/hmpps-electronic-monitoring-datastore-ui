import { Request, Response } from 'express'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'
import { AuditService, DatastoreSearchService } from '../services'
import SearchController from './searchController'
import SearchForOrdersViewModel from '../models/view-models/searchForOrders'
import orders from '../data/mockData/orders'

import { createMockRequest, createMockResponse } from '../testutils/mocks/mockExpress'
import SearchOrderFormDataModel from '../models/form-data/searchOrder'

jest.mock('../services/auditService')
jest.mock('../services/datastoreSearchService')

jest.mock('../utils/tabulateOrders', () => jest.fn(() => []))
jest.mock('../models/form-data/searchOrder')

const hmppsAuthClient = createMockHmppsAuthClient()
const datastoreClient = createDatastoreClient()
const datastoreClientFactory = jest.fn()
datastoreClientFactory.mockResolvedValue(datastoreClient)
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const datastoreSearchService = new DatastoreSearchService(datastoreClientFactory, hmppsAuthClient)

datastoreSearchService.searchForOrders = jest.fn().mockResolvedValue(orders)

jest.mock('../models/view-models/searchForOrders')
describe('SearchController', () => {
  let searchController: SearchController
  let req: Request
  let res: Response
  const next = jest.fn()
  describe('SearchController - search', () => {
    beforeEach(() => {
      searchController = new SearchController(auditService, datastoreSearchService)

      req = createMockRequest({
        flash: jest.fn().mockImplementation(() => []), // No data in req.flash
      })

      res = createMockResponse()
    })

    it('should render page with no data', async () => {
      ;(SearchForOrdersViewModel.construct as jest.Mock).mockReturnValue({
        formData: {}, // No form data
        validationErrors: [], // No validation errors
      })

      await searchController.search(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors')
      expect(req.flash).toHaveBeenCalledWith('formData')
      expect(SearchForOrdersViewModel.construct).toHaveBeenCalledWith([], [])
      expect(res.render).toHaveBeenCalledWith('pages/search', {
        formData: {},
        validationErrors: [],
      })
    })

    it('should render page with validation errors and form data', async () => {
      // Mock `req.flash` to return validation errors and form data
      req.flash = jest
        .fn()
        .mockImplementationOnce(() => [
          { field: 'firstName', error: 'First name must consist of letters only' },
          { field: 'dob', error: 'Invalid date format' },
        ])
        .mockImplementationOnce(() => [
          {
            firstName: 'John123',
            lastName: 'Doe',
            alias: 'JD',
            'dob-day': '32',
            'dob-month': '13',
            'dob-year': '2021',
          },
        ])
      ;(SearchForOrdersViewModel.construct as jest.Mock).mockReturnValue({
        formData: { firstName: 'John123', lastName: 'Doe', alias: 'JD', dob: { day: '32', month: '13', year: '2021' } },
        validationErrors: [
          { field: 'firstName', error: 'First name must consist of letters only' },
          { field: 'dob', error: 'Invalid date format' },
        ],
      })

      await searchController.search(req, res, jest.fn())

      expect(req.flash).toHaveBeenCalledWith('validationErrors')
      expect(req.flash).toHaveBeenCalledWith('formData')
      expect(SearchForOrdersViewModel.construct).toHaveBeenCalledWith(
        [
          {
            firstName: 'John123',
            lastName: 'Doe',
            alias: 'JD',
            'dob-day': '32',
            'dob-month': '13',
            'dob-year': '2021',
          },
        ],
        [
          { field: 'firstName', error: 'First name must consist of letters only' },
          { field: 'dob', error: 'Invalid date format' },
        ],
      )
      expect(res.render).toHaveBeenCalledWith('pages/search', {
        formData: { firstName: 'John123', lastName: 'Doe', alias: 'JD', dob: { day: '32', month: '13', year: '2021' } },
        validationErrors: [
          { field: 'firstName', error: 'First name must consist of letters only' },
          { field: 'dob', error: 'Invalid date format' },
        ],
      })
    })
  })

  // describe('SearchController - view', () => {
  //   beforeEach(() => {
  //     searchController = new SearchController(auditService, datastoreSearchService)
  //   })

  //   it('should parse formData from req.body using SearchOrderFormDataModel', async () => {
  //     ;(SearchOrderFormDataModel.parse as jest.Mock).mockReturnValue({
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       alias: 'JD',
  //       'dob-day': '10',
  //       'dob-month': '02',
  //       'dob-year': '2021',
  //     })

  //     req = createMockRequest({
  //       body: {
  //         firstName: 'John',
  //         lastName: 'Doe',
  //         alias: 'JD',
  //         'dob-day': '10',
  //         'dob-month': '02',
  //         'dob-year': '2021',
  //       },
  //     })
  //     res = createMockResponse()
  //     next = jest.fn()

  //     await searchController.view(req, res, next)

  //     // Assertions
  //     expect(req.body).toEqual({
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       alias: 'JD',
  //       'dob-day': '10',
  //       'dob-month': '02',
  //       'dob-year': '2021',
  //     })
  //     expect(SearchOrderFormDataModel.parse).toHaveBeenCalledWith(req.body) // Mock parse to ensure it’s called
  //   })
  // })
})
