import { validateDateRange } from '../utils/validateDateRange.js'

function init() {
  const emsDateFilters = document.getElementsByClassName('ems-date-filter')

  for (let dateFilter of emsDateFilters) {
    const filterButton = dateFilter.querySelector('.ems-date-filter__filter-button')
    const clearFilterButton = dateFilter.querySelector('.ems-date-filter__clear-filter-button')
    const startDateFields = dateFilter.querySelector('#start-date').querySelectorAll('input')
    const endDateFields = dateFilter.querySelector('#end-date').querySelectorAll('input')
    const errorMessage = dateFilter.querySelector('.govuk-error-message')
    const filterableTables = document.querySelectorAll('.date-filterable')
    const timelineItems = document.querySelectorAll('.moj-timeline__item')

    const filterElement = (element, startDate, endDate, filterDate) => {
      if ((startDate == null || filterDate > startDate) && (endDate == null || filterDate < endDate)) {
        element.classList.remove('filter-active')
      } else {
        element.classList.add('filter-active')
      }
    }

    const applyFilter = () => {
      const startDateInputs = {
        day: startDateFields[0].value,
        month: startDateFields[1].value,
        year: startDateFields[2].value,
        dateName: 'Start date',
        isPast: true,
        isMandatory: false,
      }

      const endDateInputs = {
        day: endDateFields[0].value,
        month: endDateFields[1].value,
        year: endDateFields[2].value,
        dateName: 'End date',
        isPast: false,
        isMandatory: false,
      }

      const {
        startDate: startDate,
        endDate: endDate,
        error: dateRangeError,
        errorFields,
      } = validateDateRange(startDateInputs, endDateInputs)

      if (dateRangeError) {
        dateFilter.classList.add('ems-date-filter--error')
        errorMessage.classList.remove('hidden')
        errorMessage.textContent = dateRangeError

        for (let field of dateFilter.querySelectorAll('.govuk-input')) {
          field.classList.remove('govuk-input--error')
        }
        errorFields.forEach(field => dateFilter.querySelector(`#${field}`).classList.add('govuk-input--error'))
      } else {
        dateFilter.classList.remove('ems-date-filter--error')
        errorMessage.classList.add('hidden')
        errorMessage.textContent = ''
        for (let field of dateFilter.querySelectorAll('.govuk-input')) {
          field.classList.remove('govuk-input--error')
        }

        for (let table of filterableTables) {
          const rows = table.querySelectorAll('[data-filter-date]')
          for (let row of rows) {
            const filterDate = parseInt(row.dataset.filterDate)
            filterElement(row, startDate, endDate, filterDate)
          }
          table.getElementsByClassName('moj-pagination__item--link')[0].click()
        }

        for (let item of timelineItems) {
          const filterDate = item.querySelector('time').dateTime.split('T')[0].split('-').join('')
          filterElement(item, startDate, endDate, filterDate)
        }

        if (startDate || endDate) {
          clearFilterButton.classList.remove('hidden')
        } else {
          clearFilterButton.classList.add('hidden')
        }
      }
    }

    const clearFilter = () => {
      for (let dateField of startDateFields) {
        dateField.value = ''
      }
      for (let dateField of endDateFields) {
        dateField.value = ''
      }
    }

    filterButton.addEventListener('click', function (event) {
      event.preventDefault()
      applyFilter()
    })

    clearFilterButton.addEventListener('click', function (event) {
      event.preventDefault()
      clearFilter()
      applyFilter()
      return false
    })
  }
}

export { init }
