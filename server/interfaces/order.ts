export interface Order {
  dataType: string
  legacySubjectId?: number
  name?: string
  addressLine1?: string
  addressLine2?: string
  addressLine3?: string
  addressPostcode?: string
  alias?: string | null
  dateOfBirth?: string
  orderStartDate?: string
  orderEndDate?: string
}
