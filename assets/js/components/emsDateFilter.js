import { validateDate } from '../utils/validateDate.js'

function init() {
  const emsDateFilters = document.getElementsByClassName('ems-date-filter')

  for (let dateFilter of emsDateFilters) {
    // Method for the filter button
    const applyFilter = () => {
      // Get date inputs
      const startDateInputs = dateFilter.querySelector('#start-date').querySelectorAll('input')
      const endDateInputs = dateFilter.querySelector('#end-date').querySelectorAll('input')

      //Validate dates
      const validatedStartDate = validateDate(
        startDateInputs[0].value,
        startDateInputs[1].value,
        startDateInputs[2].value,
        'Start date',
        false,
        true,
      )

      const validatedEndDate = validateDate(
        endDateInputs[0].value,
        endDateInputs[1].value,
        endDateInputs[2].value,
        'End date',
        false,
        false,
      )

      // Filter the records
      const filterableTables = document.querySelectorAll('.date-filterable')

      if (validatedStartDate.error || validatedEndDate.error) {
        console.log('Date validation failed. Filter was not applied.')
        console.log(
          validatedStartDate.error ? 'Start date error: ' + validatedStartDate.error : 'No error in start date.',
        )
        console.log(validatedEndDate.error ? 'End date error: ' + validatedEndDate.error : 'No error in end date.')
      } else {
        for (let table of filterableTables) {
          const rows = table.querySelectorAll('[data-filter-date]')

          for (let row of rows) {
            const filterDate = parseInt(row.dataset.filterDate)
            const startDate = validatedStartDate.dateString
            const endDate = validatedEndDate.dateString

            if ((startDate == null || filterDate > startDate) && (endDate == null || filterDate < endDate)) {
              row.classList.remove('filter-active')
            } else {
              row.classList.add('filter-active')
            }
          }

          // Invoke the table's pagination, returning it to page 1 and refreshing the results table.
          table.getElementsByClassName('moj-pagination__item--link')[0].click()
        }
      }
    }

    const filterButton = dateFilter.querySelector('.ems-date-filter__filter-button')

    filterButton.addEventListener('click', function (event) {
      event.preventDefault()
      applyFilter()
    })
  }
}

export { init }
