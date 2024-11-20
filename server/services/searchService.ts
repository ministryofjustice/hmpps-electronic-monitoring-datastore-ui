import { ZodTypeAny } from 'zod'
import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orders from '../data/mockData/orders'
import { Order } from '../interfaces/order'
import { SearchOrderFormData } from '../models/form-data/searchOrder'
import { ValidationResult } from '../models/Validation'
import { DateValidator } from '../utils/validators/dateValidator'
import Validator from '../utils/validators/formFieldValidator'

type SearchFormInput = {
  token: string
  data: SearchOrderFormData
}

export default class SearchService {
  async getOrders(): Promise<Order[]> {
    try {
      return orders
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving search results')
      return error
    }
  }

  async search(input: SearchFormInput): Promise<Order[] | ValidationResult> {
    const validationErrors: ValidationResult = []

    const isDobValid = DateValidator.validateDate(
      input.data['dob-day'],
      input.data['dob-month'],
      input.data['dob-year'],
      'dob',
    )

    if (isDobValid.result === false) {
      validationErrors.push(isDobValid.error!)
    }

    ;['firstName', 'lastName', 'alias'].forEach(field => {
      const fieldValue = input.data[field as keyof SearchFormInput['data']]
      const validator = Validator[field as keyof typeof Validator] as ZodTypeAny

      const validationResult = validator.safeParse(fieldValue)

      if (!validationResult.success) {
        validationErrors.push({
          field,
          error: validationResult.error.issues[0].message,
        })
      }
    })
    // Return validation errors if any exist
    if (validationErrors.length > 0) {
      return validationErrors
    }
    return orders
  }
}
