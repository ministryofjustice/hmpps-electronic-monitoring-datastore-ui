interface KeyOrderDetails {
  legacy_subject_id: string
  name: string
  alias: string | null
  date_of_birth: string
  postcode: string
  address_1: string
  address_2: string | null
  address_3: string | null
  tag_type: string
  start_date: string
  end_date: string
}

interface Reports {
  back: string
  order_details: string
  visits_and_tasks: string
  event_hsitory: string
  equipment_details: string
  curfew_hours: string
  curfew_violations: string
  contact_history: string
  suspensions: string
}

interface SubjectHistoryReport {
  report_url: string
  name: string
  created_on: string
  time: string
}

interface OrderDocument {
  name: string
  url: string
  created_on: string
  time: string
  notes: string
}

export interface OrderDetails {
  keyOrderDetails: KeyOrderDetails
  subjectHistoryReport: SubjectHistoryReport
  reports: Reports
  documents: {
    pageSize: number
    orderDocuments: OrderDocument[]
  }
}
