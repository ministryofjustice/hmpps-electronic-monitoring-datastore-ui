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

interface Reports {
  orderDetails: string
  visitsAndTasks: string
  eventHistory: string
  equipmentDetails: string
  curfewHours: string
  curfewViolations: string
  contactHistory: string
  suspensions: string
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

export interface OrderSummary {
  backUrl: string
  keyOrderDetails: KeyOrderDetails
  subjectHistoryReport: SubjectHistoryReport
  reports: Reports
  documents: {
    pageSize: number
    orderDocuments: OrderDocument[]
  }
}
