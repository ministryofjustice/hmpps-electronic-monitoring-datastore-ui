import { ZodError, ZodTypeAny } from 'zod'
import { DateValidator } from '../utils/validators/dateValidator'

import SearchService from './searchService'
import orders from '../data/mockData/orders'
import Validator from '../utils/validators/formFieldValidator'

jest.mock('../utils/validators/dateValidator')

describe('Search service', () => {
  let searchService: SearchService

  beforeEach(() => {
    searchService = new SearchService()
  })

  describe('getOrders', () => {
    it('returns orders', async () => {
      const expectedData = orders
      const results = await searchService.getOrders()
      expect(results).toBe(expectedData)
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

      const result = await searchService.search(validInput)

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

      const result = await searchService.search(invalidInput)

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

    const result = await searchService.search(invalidInput)

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
