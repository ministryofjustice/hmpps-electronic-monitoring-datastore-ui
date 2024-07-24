import { validateDate } from './validateDate.js'

function validateDateRange(startDateInputs, endDateInputs) {
  const dateRange = {
    startDate: validateDate(startDateInputs),
    endDate: validateDate(endDateInputs),
    error: null,
    errorFields: null,
  }

  if (dateRange.startDate.error) {
    dateRange.error = dateRange.startDate.error
    dateRange.errorFields = dateRange.startDate.errorFields.map(field => `start-date-${field}`)
  } else if (dateRange.endDate.error) {
    dateRange.error = dateRange.endDate.error
    dateRange.errorFields = dateRange.endDate.errorFields.map(field => `end-date-${field}`)
  } else if (
    dateRange.startDate.dateString &&
    dateRange.endDate.dateString &&
    dateRange.startDate.dateString > dateRange.endDate.dateString
  ) {
    dateRange.error = 'The start date must be the same as or after the end date'
    dateRange.errorFields = [
      'start-date-day',
      'start-date-month',
      'start-date-year',
      'end-date-day',
      'end-date-month',
      'end-date-year',
    ]
  }

  return dateRange
}

export { validateDateRange }
