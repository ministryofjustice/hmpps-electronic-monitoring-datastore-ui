import { Token } from '../interfaces/token'
import { SearchOrderFormData } from '../models/form-data/searchOrder'

export type SearchFormInput = Token & {
  data: SearchOrderFormData
}
