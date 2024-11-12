import { Record } from './records'

export interface Event {
  name: string
  date: string
  records: Record[]
}
export interface Events {
  backUrl: string
  events: Event[]
  heading?: string
}

export interface VisitDetailsEvent {
  name: string
  date: string
  address: string
  records: Record[]
}

export interface VisitDetails {
  backUrl: string
  events: VisitDetailsEvent[]
  heading?: string
}
