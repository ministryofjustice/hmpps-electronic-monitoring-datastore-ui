import { ZodError } from 'zod'
import DatastoreSearchService from './datastoreSearchService'
import orders from '../data/mockData/orders'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

import { Order } from '../interfaces/order'
import { DateValidator } from '../utils/validators/dateValidator'
import Validator from '../utils/validators/formFieldValidator'
import { SearchFormInput } from '../types/SearchFormInput'
import { ValidationResult } from '../models/Validation'

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
    it('should return data from the client - `searchForOrders`', async () => {
      const searchItem: Order = {
        dataType: 'am',
        legacySubjectId: 1,
      }
      const expectedData: Order[] = orders
      datastoreClient.searchForOrders.mockResolvedValue(expectedData)

      const results = await datastoreSearchService.searchForOrders(searchItem)
      expect(results).toEqual(expectedData)
    })

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

  describe('validateInput', () => {
    it('returns validation errors when firstName is invalid', async () => {
      jest.spyOn(DateValidator, 'validateDate').mockReturnValue({ result: true })

      jest.spyOn(Validator.firstName, 'safeParse').mockImplementation(() => {
        return {
          success: false,
          error: new ZodError([
            {
              code: 'custom',
              path: ['firstName'],
              message: 'First name must contain letters only',
            },
          ]),
        }
      })

      const invalidInput = {
        token: 'mockToken',
        data: {
          firstName: 'John123',
          'dob-day': '10',
          'dob-month': '02',
          'dob-year': '2021',
        },
      }

      const result: ValidationResult = datastoreSearchService.validateInput(invalidInput)

      expect(Validator.firstName.safeParse).toHaveBeenCalledWith('John123')
      expect(result).toEqual([
        {
          field: 'firstName',
          error: 'First name must contain letters only',
        },
      ])
    })

    it('returns validation errors when dob is invalid', async () => {
      jest.spyOn(DateValidator, 'validateDate').mockReturnValue({
        result: false,
        error: {
          field: 'dob',
          error:
            'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2020.',
        },
      })

      jest.spyOn(Validator.firstName, 'safeParse').mockImplementation(() => {
        return { success: true, data: '' }
      })

      const invalidInput = {
        token: 'mockToken',
        data: {
          firstName: 'John',
          'dob-day': '32',
          'dob-month': '13',
          'dob-year': '2021',
        },
      }

      const result: ValidationResult = datastoreSearchService.validateInput(invalidInput)

      // Assertions
      expect(DateValidator.validateDate).toHaveBeenCalledWith('32', '13', '2021', 'dob')
      expect(result).toEqual([
        {
          field: 'dob',
          error:
            'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2020.',
        },
      ])
    })

    it('returns multiple errors when multiple fields are invalid', async () => {
      jest.spyOn(DateValidator, 'validateDate').mockReturnValue({
        result: false,
        error: {
          field: 'dob',
          error:
            'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2020.',
        },
      })

      jest.spyOn(Validator.firstName, 'safeParse').mockImplementation(() => {
        return {
          success: false,
          error: new ZodError([
            {
              code: 'custom',
              path: ['firstName'],
              message: 'First name must contain letters only',
            },
          ]),
        }
      })

      const invalidInput = {
        token: 'mockToken',
        data: {
          firstName: 'John123',
          'dob-day': '32',
          'dob-month': '13',
          'dob-year': '2021',
        },
      }

      const result: ValidationResult = datastoreSearchService.validateInput(invalidInput)

      // Assertions
      expect(Validator.firstName.safeParse).toHaveBeenCalledWith('John123')
      expect(DateValidator.validateDate).toHaveBeenCalledWith('32', '13', '2021', 'dob')
      expect(result).toEqual([
        {
          field: 'dob',
          error:
            'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2020.',
        },
        {
          field: 'firstName',
          error: 'First name must contain letters only',
        },
      ])
    })

    it('returns no errors when form data is valid', async () => {
      jest.spyOn(DateValidator, 'validateDate').mockReturnValue({ result: true })
      jest.spyOn(Validator.firstName, 'safeParse').mockImplementation(() => {
        return { success: true, data: '' }
      })

      const validInput = {
        token: 'mockToken',
        data: {
          firstName: 'John',
          'dob-day': '10',
          'dob-month': '02',
          'dob-year': '2021',
        },
      }

      const result: ValidationResult = datastoreSearchService.validateInput(validInput)

      // Assertions
      expect(Validator.firstName.safeParse).toHaveBeenCalledWith('John')
      expect(DateValidator.validateDate).toHaveBeenCalledWith('10', '02', '2021', 'dob')
      expect(result).toEqual([])
    })
    // TODO: Additional tests:
    // Generates input error if the input is empty
    it('returns an error when the input is empty', async () => {})
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

    // it('returns a validation error when no data is supplied', async () => {
    //   jest.spyOn(DateValidator, 'validateDate').mockReturnValue({ result: true })

    //   jest.spyOn(Validator.firstName, 'safeParse').mockImplementation(() => {
    //     return {
    //       success: false,
    //       error: new ZodError([
    //         {
    //           code: 'custom',
    //           path: ['firstName'],
    //           message: 'First name can only consist of letters',
    //         },
    //       ]),
    //     }
    //   })

    //   const invalidInput = {
    //     token: 'mockToken',
    //     data: {
    //       firstName: 'John123',
    //       lastName: 'Doe',
    //       alias: 'JD',
    //       'dob-day': '10',
    //       'dob-month': '02',
    //       'dob-year': '2021',
    //     },
    //   }

    //   const result = await datastoreSearchService.search(invalidInput)

    //   expect(Validator.firstName.safeParse).toHaveBeenCalledWith('John123')
    //   expect(result).toEqual([
    //     {
    //       field: 'firstName',
    //       error: 'First name can only consist of letters',
    //     },
    //   ])
    // })
  })
})
