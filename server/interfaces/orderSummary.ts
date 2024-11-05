interface KeyOrderDetails {
  legacySubjectId: string
  name: string
  alias: string | null
  dateOfBirth: string
  postcode: string
  address1: string
  address2: string | null
  address3: string | null
  tagType: string
  startDate: string
  endDate: string
}

interface SubjectHistoryReport {
  reportUrl: string
  name: string
  createdOn: string
  time: string
}

interface OrderDocument {
  name: string
  url: string
  createdOn: string
  time: string
  notes: string
}

export interface Reports {
  orderDetails: boolean
  visitsAndTasks: boolean
  eventHistory: boolean
  equipmentDetails: boolean
  curfewHours: boolean
  curfewViolations: boolean
  contactHistory: boolean
  suspensions: boolean
}

export interface OrderSummary {
  keyOrderDetails: KeyOrderDetails
  subjectHistoryReport: SubjectHistoryReport
  documents: {
    pageSize: number
    orderDocuments: OrderDocument[]
  }
}
