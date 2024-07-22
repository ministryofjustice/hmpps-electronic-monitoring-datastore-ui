function validateDate(day, month, year, dateName, isPast) {
  const date = {
    value: new Date(`${year + '/' + month + '/' + day}`),
    error: null,
  }

  const now = new Date().setHours(0, 0, 0, 0)

  if ((day == null) & (month == null) & (year == null)) {
    date.error = 'Enter a date.'
    return date
  }

  if (day == null) {
    date.error = 'Enter a day.'
    return date
  }

  if (month == null) {
    date.error = 'Enter a month.'
    return date
  }

  if (year == null) {
    date.error = 'Enter a year.'
    return date
  }

  if (isNaN(date.value)) {
    date.error = `${dateName} must be a real date.`
    return date
  }

  if (isPast && date.value > now) {
    date.error = `${dateName} must be in the past.`
    return date
  }

  return date
}

export { validateDate }
