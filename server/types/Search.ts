import { QueryExecutionResponse } from '../interfaces/QueryExecutionResponse'
import { Token } from '../interfaces/token'
import { ParsedSearchFormData } from '../models/form-data/searchOrder'

export type SearchFormInput = Token & {
  data: ParsedSearchFormData
}

export type SearchResultsRequest = Token & QueryExecutionResponse
