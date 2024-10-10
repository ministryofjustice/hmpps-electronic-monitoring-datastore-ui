export interface Record {
  key: string
  value: string
}

export interface Records {
  backUrl: string
  records: Record[]
}

export interface TablatedRecords {
  backUrl: string
  records: { text: string }[][]
  heading?: string
}
