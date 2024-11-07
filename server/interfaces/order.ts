export interface Order {
  dataType: string
  legacySubjectId?: number
  name?: string
  address?: string
  alias?: string | null
  dateOfBirth?: string
  orderStartDate?: string
  orderEndDate?: string
}

export interface SearchCriteria {
  dataType: string
  legacySubjectId?: number
  firstName?: string
  lastName?: string
  alias?: string | null
  dateOfBirth?: string
}
