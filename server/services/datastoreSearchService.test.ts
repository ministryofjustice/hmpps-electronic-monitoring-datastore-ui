import { ZodError } from 'zod'
import DatastoreSearchService from './datastoreSearchService'
import orders from '../data/mockData/orders'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

import { Order } from '../interfaces/order'
import { DateValidator } from '../utils/validators/dateValidator'
import Validator from '../utils/validators/formFieldValidator'
import { SearchFormInput } from '../types/SearchFormInput'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreClient')

describe('Datastore Search Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const datastoreClient = createDatastoreClient()

  const datastoreClientFactory = jest.fn()

  let datastoreSearchService: DatastoreSearchService

  beforeEach(() => {
    datastoreClientFactory.mockReturnValue(datastoreClient)
    datastoreSearchService = new DatastoreSearchService(datastoreClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set up and tear down the tests successfully', async () => {
    expect(true).toBe(true)
  })

  describe('getOrders', () => {
    it('should return data from the client - `searchOrders`', async () => {
      const searchOrder: SearchFormInput = {
        userToken: 'mockUserToken',
        data: {
          searchType: 'am',
          legacySubjectId: '123',
          firstName: 'John',
          lastName: 'Doe',
          alias: 'JD',
          'dob-day': '01',
          'dob-month': '01',
          'dob-year': '1990',
        },
      }
      const expectedData: Order[] = orders
      datastoreClient.searchOrders.mockResolvedValue(expectedData)

      const results = await datastoreSearchService.search(searchOrder)
      expect(results).toEqual(expectedData)
    })
  })

  describe('search', () => {
    it('returns orders when firstName is valid', async () => {
      // Mock dependencies
      jest.spyOn(DateValidator, 'validateDate').mockReturnValue({ result: true })

      jest.spyOn(Validator.firstName, 'safeParse').mockImplementation((input: string) => ({
        success: true,
        data: input,
      }))

      const validInput = {
        token: 'mockToken',
        data: {
          firstName: 'John',
          lastName: 'Doe',
          alias: 'JD',
          'dob-day': '10',
          'dob-month': '02',
          'dob-year': '2021',
        },
      }
      datastoreClient.searchOrders.mockResolvedValue(orders)
      const result = await datastoreSearchService.search(validInput)

      expect(Validator.firstName.safeParse).toHaveBeenCalledWith('John')
      expect(result).toEqual(orders)
    })

    it('returns validation errors when firstName is invalid', async () => {
      jest.spyOn(DateValidator, 'validateDate').mockReturnValue({ result: true })

      jest.spyOn(Validator.firstName, 'safeParse').mockImplementation(() => {
        return {
          success: false,
          error: new ZodError([
            {
              code: 'custom',
              path: ['firstName'],
              message: 'First name can only consist of letters',
            },
          ]),
        }
      })

      const invalidInput = {
        token: 'mockToken',
        data: {
          firstName: 'John123',
          lastName: 'Doe',
          alias: 'JD',
          'dob-day': '10',
          'dob-month': '02',
          'dob-year': '2021',
        },
      }

      const result = await datastoreSearchService.search(invalidInput)

      expect(Validator.firstName.safeParse).toHaveBeenCalledWith('John123')
      expect(result).toEqual([
        {
          field: 'firstName',
          error: 'First name can only consist of letters',
        },
      ])
    })
  })
  it('returns validation errors when dob is invalid', async () => {
    jest.spyOn(DateValidator, 'validateDate').mockReturnValue({
      result: false,
      error: {
        field: 'dob',
        error: 'Invalid date format',
      },
    })

    jest.spyOn(Validator.firstName, 'safeParse').mockImplementation(() => {
      return { success: true, data: '' }
    })

    const invalidInput = {
      token: 'mockToken',
      data: {
        firstName: '',
        'dob-day': '32',
        'dob-month': '13',
        'dob-year': '2021',
      },
    }

    const result = await datastoreSearchService.search(invalidInput)

    // Assertions
    expect(DateValidator.validateDate).toHaveBeenCalledWith('32', '13', '2021', 'dob')
    expect(result).toEqual([
      {
        field: 'dob',
        error: 'Invalid date format',
      },
    ])
  })
})
