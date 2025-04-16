export interface KeyOrderInformation {
  specials: string
  legacySubjectId: number
  name: string
  alias: string | null
  dateOfBirth: string
  postcode: string
  address1: string
  address2: string | null
  address3: string | null
  orderStartDate: string
  orderEndDate: string
}

export interface SubjectHistoryReport {
  reportUrl: string
  name: string
  createdOn: string
  time: string
}

export interface OrderDocument {
  name: string
  url: string
  createdOn: string
  time: string
  notes: string
}

export interface Reports {
  orderDetails: boolean
  visitDetails: boolean
  // visitsAndTasks: boolean
  // eventHistory: boolean
  equipmentDetails: boolean
  // curfewHours: boolean
  // curfewViolations: boolean
  // contactHistory: boolean
  // suspensions: boolean
  suspensionOfVisits: boolean
  allEventHistory: boolean
  services: boolean
}

export interface IntegrityOrderSummary {
  keyOrderInformation: KeyOrderInformation
  subjectHistoryReport: SubjectHistoryReport
  documents: {
    pageSize: number
    orderDocuments: OrderDocument[]
  }
}
