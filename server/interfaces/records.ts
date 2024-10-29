export interface Record {
  key: string
  value: string
}

export interface Records {
  backUrl: string
  records: Record[]
}

export interface TabulatedRecords {
  backUrl: string
  records: { text: string }[][]
  heading?: string
}