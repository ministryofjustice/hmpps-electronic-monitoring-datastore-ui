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
