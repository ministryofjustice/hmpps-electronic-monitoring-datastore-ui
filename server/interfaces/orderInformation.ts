interface KeyOrderInformation {
  specials: string
  legacySubjectId: string
  legacyOrderId: string
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

export interface OrderInformation {
  keyOrderInformation: KeyOrderInformation
  subjectHistoryReport: SubjectHistoryReport
  documents: {
    pageSize: number
    orderDocuments: OrderDocument[]
  }
}
