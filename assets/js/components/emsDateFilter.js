import { validateDateRange } from '../utils/validateDateRange.js'

function init() {
  const emsDateFilters = document.getElementsByClassName('ems-date-filter')

  for (let dateFilter of emsDateFilters) {
    // Get buttons
    const filterButton = dateFilter.querySelector('.ems-date-filter__filter-button')
    const clearFiltersButton = dateFilter.querySelector('.ems-date-filter__clear-filters-button')

    // Get filter date elements
    const startDateFields = dateFilter.querySelector('#start-date').querySelectorAll('input')
    const endDateFields = dateFilter.querySelector('#end-date').querySelectorAll('input')
    const errorMessage = dateFilter.querySelector('.govuk-error-message')

    //Get all filterable tables within the page
    const filterableTables = document.querySelectorAll('.date-filterable')

    // Method for the filter button
    const applyFilter = () => {
      //Validate dates
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

      // If input validation fails, show error message & styling.
      // Else, remove error messge & styling & filter the table.
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

        // Filter the records if there are no validation errors.
        for (let table of filterableTables) {
          const rows = table.querySelectorAll('[data-filter-date]')

          for (let row of rows) {
            const filterDate = parseInt(row.dataset.filterDate)
            // const startDate = startDateString
            // const endDate = endDateString

            if ((startDate == null || filterDate > startDate) && (endDate == null || filterDate < endDate)) {
              row.classList.remove('filter-active')
            } else {
              row.classList.add('filter-active')
            }
          }

          // If any records are filtered out, show the clear filters button
          if (table.querySelectorAll('.filter-active').length) {
            clearFiltersButton.classList.remove('hidden')
          } else {
            clearFiltersButton.classList.add('hidden')
          }

          // Invoke the table's pagination, returning it to page 1 and refreshing the results table.
          table.getElementsByClassName('moj-pagination__item--link')[0].click()
        }
      }
    }

    // Method for the clear filters button
    const clearFilters = () => {
      for (let dateField of startDateFields) {
        dateField.value = ''
      }
      for (let dateField of endDateFields) {
        dateField.value = ''
      }
    }

    // Initialise the filter button
    filterButton.addEventListener('click', function (event) {
      event.preventDefault()
      applyFilter()
    })

    // Initialise the clear filters button
    clearFiltersButton.addEventListener('click', function (event) {
      event.preventDefault()
      clearFilters()
      applyFilter()
      return false
    })
  }
}

export { init }
