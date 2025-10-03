export type ErrorSummary = {
  title?: string
  description?: string
  errorList: Array<ErrorListItem>
}

export type ErrorListItem = {
  field?: string
  message?: string
}

export type ErrorMessage = {
  text: string
}

export type FormField = {
  error?: ErrorMessage
}

export type TextField = FormField & {
  value: string
}

export type Date = {
  day: string
  month: string
  year: string
}

export type DateField = FormField & {
  value: Date
}

export type MultipleChoiceField = FormField & {
  values: Array<string>
}

export type ViewModel<T> = {
  errorSummary: ErrorSummary | null
} & {
  [K in keyof T]: T[K] extends Date ? DateField : T[K] extends string[] ? MultipleChoiceField : TextField
}

export type ErrorsViewModel = {
  [field: string]: ErrorMessage
}
