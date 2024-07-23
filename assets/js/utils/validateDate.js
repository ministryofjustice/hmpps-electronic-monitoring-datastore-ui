function validateDate(day, month, year, dateName, isMandatory, isPast) {
  const date = {
    dateStamp: new Date(`${year + '/' + month + '/' + day}`),
    dateString: null,
    error: null,
  }

  const now = new Date().setHours(0, 0, 0, 0)

  const isNumericalString = string => string.match(/^\d+$/)

  if (!day & !month & !year && isMandatory) {
    date.error = 'Enter a date.'
    return date
  } else if (!day & !month & !year) {
    date.dateStamp = null
    return date
  }

  if (isNaN(date.dateStamp)) {
    date.error = `${dateName} must be a real date.`
    return date
  }

  if (!day) {
    date.error = 'Enter a day.'
    return date
  }

  if (!month) {
    date.error = 'Enter a month.'
    return date
  }

  if (!year) {
    date.error = 'Enter a year.'
    return date
  }

  if (!isNumericalString(day) || !isNumericalString(month) || !isNumericalString(year)) {
    date.error = `${dateName} must be a real date.`
    return date
  }

  if (year && year.length != 4) {
    date.error = `Enter a full year (eg. 2001).`
    return date
  }

  if (isPast && date.value > now) {
    date.error = `${dateName} must be in the past.`
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
