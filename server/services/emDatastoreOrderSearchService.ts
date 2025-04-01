import { ZodTypeAny } from 'zod'
import logger from '../../logger'
import getSanitisedError, { SanitisedError } from '../sanitisedError'
import { Order } from '../interfaces/order'
import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import { HmppsAuthClient, RestClientBuilder } from '../data'
import { ValidationResult } from '../models/Validation'
import { SearchFormInput, SearchResultsRequest } from '../types/Search'
import { DateValidationResponse, dateValidator } from '../utils/validators/dateValidator'
import NameValidator from '../utils/validators/nameValidator'
import { ParsedSearchFormData } from '../models/form-data/searchOrder'
import { QueryExecutionResponse } from '../interfaces/QueryExecutionResponse'

export default class EmDatastoreOrderSearchService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialised')
  }

  isEmptySearch(searchData: ParsedSearchFormData): boolean {
    const { searchType, ...mandatoryFields } = searchData
    return Object.values(mandatoryFields).every(value => value === '' || value === undefined)
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

    const parsedDateOfBirth: DateValidationResponse = dateValidator.parse({
      day: input.data.dobDay,
      month: input.data.dobMonth,
      year: input.data.dobYear,
    })
    if (!parsedDateOfBirth.isValid) {
      validationErrors.push(parsedDateOfBirth.error!)
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

  async submitSearchQuery(input: SearchFormInput): Promise<QueryExecutionResponse> {
    try {
      this.emDatastoreApiClient.updateToken(input.userToken)
      const queryExecutionId = await this.emDatastoreApiClient.submitSearchQuery(input)

      return queryExecutionId
    } catch (error) {
      const sanitisedError: SanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, 'Error submitting search query')
      sanitisedError.message = 'Error submitting search query'
      throw sanitisedError
    }
  }

  async getSearchResults(request: SearchResultsRequest): Promise<Order[]> {
    try {
      this.emDatastoreApiClient.updateToken(request.userToken)
      return await this.emDatastoreApiClient.getSearchResults(request)
    } catch (error) {
      let userFreindlyMessage = 'Error retrieving search results'
      const sanitisedError = getSanitisedError(error)

      const errorMessage: string | undefined = error.data?.developerMessage
      if (
        errorMessage &&
        errorMessage.includes('QueryExecution') &&
        errorMessage.includes('was not found (Service: Athena, Status Code: 400, Request ID:')
      ) {
        userFreindlyMessage += ': Invalid query execution ID'
      }

      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
