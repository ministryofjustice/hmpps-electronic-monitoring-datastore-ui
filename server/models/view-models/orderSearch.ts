import { OrderSearchCriteria } from '../requests/SearchOrdersRequest'
import { FormError } from '../../@types/express'

export type OrderSearchView = {
  searchType: string
  legacySubjectId?: string
  firstName?: string
  lastName?: string
  alias?: string
  dobDay?: string
  dobMonth?: string
  dobYear?: string
  validationErrors?: Array<FormError>
}
export const OrderSearchView = {
  construct(
    formData: OrderSearchCriteria = {} as OrderSearchCriteria,
    validationErrors: FormError[] = [],
  ): OrderSearchView {
    return createViewFromFormData(formData, validationErrors)
  },
}

const createViewFromFormData = (formData: OrderSearchCriteria, validationErrors: FormError[]): OrderSearchView => {
  return {
    ...formData,
    validationErrors,
  }
}
