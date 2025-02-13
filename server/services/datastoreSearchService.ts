import { ZodTypeAny } from 'zod'
import logger from '../../logger'
import getSanitisedError, { SanitisedError } from '../sanitisedError'
import { Orders } from '../interfaces/order'
import DatastoreClient from '../data/datastoreClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'
import { ValidationResult } from '../models/Validation'
import { SearchFormInput } from '../types/SearchFormInput'
import { DateValidationResponse, DateValidator } from '../utils/validators/dateValidator'
import NameValidator from '../utils/validators/nameValidator'
import { SearchOrderFormData } from '../models/form-data/searchOrder'

export default class DatastoreSearchService {
  private readonly datastoreClient: DatastoreClient

  constructor(
    private readonly datastoreClientFactory: RestClientBuilder<DatastoreClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.datastoreClient = this.datastoreClientFactory('uninitialised')
  }

  isEmptySearch(searchData: SearchOrderFormData): boolean {
    return Object.values(searchData).every(value => value === '')
  }

  validateInput(input: SearchFormInput): ValidationResult {
    const validationErrors: ValidationResult = []

    if (this.isEmptySearch(input.data)) {
      validationErrors.push({
        field: 'emptyForm',
        error: 'You must enter a value into at least one search field',
      })
      return validationErrors
    }

    const isDobValid: DateValidationResponse = DateValidator.validateDate(
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
      const validator = NameValidator[field as keyof typeof NameValidator] as ZodTypeAny

      const validationResult = validator.safeParse(fieldValue)

      if (!validationResult.success) {
        validationErrors.push({
          field,
          error: validationResult.error.issues[0].message,
        })
      }
    })

    return validationErrors
  }

  async search(input: SearchFormInput): Promise<Orders> {
    try {
      this.datastoreClient.updateToken(input.userToken)

      const results: Orders = await this.datastoreClient.searchOrders(input)
      return results
    } catch (error) {
      const sanitisedError: SanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, 'Error retrieving search results')
      sanitisedError.message = 'Error retrieving search results'
      throw sanitisedError
    }
  }
}
