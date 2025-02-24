export interface Order {
  dataType: string
  legacySubjectId?: number
  name?: string
  primaryAddressLine1?: string
  primaryAddressLine2?: string
  primaryAddressLine3?: string
  primaryAddressPostCode?: string
  alias?: string | null
  dateOfBirth?: string
  orderStartDate?: string
  orderEndDate?: string
}
