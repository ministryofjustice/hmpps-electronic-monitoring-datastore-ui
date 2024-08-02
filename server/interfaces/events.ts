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
