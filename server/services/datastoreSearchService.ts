import { ZodTypeAny } from 'zod'
import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import { Order } from '../interfaces/order'
import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'

import { SearchOrderFormData } from '../models/form-data/searchOrder'
import { ValidationResult } from '../models/Validation'
import { DateValidator } from '../utils/validators/dateValidator'
import Validator from '../utils/validators/formFieldValidator'
import orders from '../data/mockData/orders'

type SearchFormInput = {
  token: string
  data: SearchOrderFormData
}
export default class DatastoreSearchService {
  private readonly datastoreClient: DatastoreClient

  constructor(
    private readonly datastoreClientFactory: RestClientBuilder<DatastoreClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.datastoreClient = this.datastoreClientFactory('uninitialised')
  }

  async searchForOrders(criteria: Order): Promise<Order[]> {
    try {
      this.datastoreClient.updateToken(await this.hmppsAuthClient.getSystemClientToken())

      const results = this.datastoreClient.searchForOrders(criteria)
      return results
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
