function validateDate(dateInputs) {
  const { day, month, year, dateName, isPast, isMandatory } = dateInputs

  const date = {
    dateStamp: new Date(`${year + '/' + month + '/' + day}`),
    dateString: null,
    error: null,
    errorType: null,
  }

  const now = new Date().setHours(0, 0, 0, 0)

  const isNumericalString = string => string.match(/^\d+$/)

  if (!day & !month & !year && isMandatory) {
    date.error = 'Enter a date.'
    date.errorType = 'all'
    return date
  } else if (!day & !month & !year) {
    date.dateStamp = null
    return date
  }

  if (isNaN(date.dateStamp)) {
    date.error = `${dateName} must be a real date.`
    date.errorType = 'all'
    return date
  }

  if (!day) {
    date.error = 'Enter a day.'
    date.errorType = 'day'
    return date
  }

  if (!month) {
    date.error = 'Enter a month.'
    date.errorType = 'month'
    return date
  }

  if (!year) {
    date.error = 'Enter a year.'
    date.errorType = 'year'
    return date
  }

  if (!isNumericalString(day) || !isNumericalString(month) || !isNumericalString(year)) {
    date.error = `${dateName} must be a real date.`
    date.errorType = 'all'
    return date
  }

  if (year && year.length != 4) {
    date.error = `Enter a full year (eg. 2001).`
    date.errorType = 'year'
    return date
  }

  if (isPast && date.value > now) {
    date.error = `${dateName} must be in the past.`
    date.errorType = 'all'
    return date
  }

  // If validation is successful,
  // Convert the input date to a time string in format YYYYMMDD & return it
  const offset = date.dateStamp.getTimezoneOffset()
  const offsetDate = new Date(date.dateStamp.getTime() - offset * 60 * 1000)
  date.dateString = offsetDate.toISOString().split('T')[0].replaceAll('-', '')

  return date
}

export { validateDate }
