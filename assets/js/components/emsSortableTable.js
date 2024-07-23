function init() {
  const emsSortableTables = document.getElementsByClassName('ems-sortable-table')

  for (let table of emsSortableTables) {
    const pageSize = parseInt(table.dataset.pageSize)
    let currentPage = parseInt(table.dataset.currentPage)
    let rows
    let totalRows
    let totalPages

    // Function to get the number of table rows and pages, accounting for filtered-out rows, and set these variables.
    const setRowsAndPages = () => {
      const unfilteredRows = Array.from(table.getElementsByClassName('govuk-table__data-row'))
      rows = unfilteredRows.filter(row => !row.classList.contains('filter-active'))
      totalRows = rows.length
      totalPages = Math.ceil(totalRows / pageSize)
      currentPage = currentPage <= totalPages ? currentPage : 1
    }
    setRowsAndPages()

    // If there are no Rows, show a message to this effect.
    // Otherwise, execute code for the component.
    if (totalRows == 0) {
      table.querySelector('.govuk-table').classList.add('hidden')
      table.querySelector('.ems-sortable-table__no-results').classList.remove('hidden')
    } else {
      table.querySelector('.govuk-table').classList.remove('hidden')
      table.querySelector('.ems-sortable-table__no-results').classList.add('hidden')

      // Get pagination elements
      const pagination = table.querySelector('.moj-pagination')
      const allPaginationButtons = pagination.querySelectorAll('.moj-pagination__item')
      const prevButton = pagination.querySelector('.moj-pagination__item--prev')
      const nextButton = pagination.querySelector('.moj-pagination__item--next')
      const pageButtons = pagination.getElementsByClassName('moj-pagination__item--link')
      const dots = pagination.getElementsByClassName('moj-pagination__item--dots')
      const paginationResults = pagination.querySelector('.moj-pagination__results').getElementsByTagName('b')

      // Function to update the table to show the correct page's Rows.
      const updateTable = () => {
        setRowsAndPages()
        const firstIndex = (currentPage - 1) * pageSize
        const lastIndex = currentPage * pageSize

        rows.forEach((row, index) => {
          if (index >= firstIndex && index <= lastIndex - 1) {
            row.classList.remove('hidden')
          } else {
            row.classList.add('hidden')
          }
        })
      }

      // Function to update the pagination component when pagination is used.
      const updatePagination = () => {
        setRowsAndPages()

        // Show or hide previous & next buttons
        currentPage == 1 ? prevButton.classList.add('hidden') : prevButton.classList.remove('hidden')
        currentPage == totalPages ? nextButton.classList.add('hidden') : nextButton.classList.remove('hidden')

        // Show or hide dots
        if (totalPages > 5) {
          currentPage < 4 ? dots[0].classList.add('hidden') : dots[0].classList.remove('hidden')

          currentPage > totalPages - 3 ? dots[1].classList.add('hidden') : dots[1].classList.remove('hidden')
        } else {
          dots[0].classList.add('hidden')
          dots[1].classList.add('hidden')
        }

        for (let button of pageButtons) {
          const buttonNumber = parseInt(button.dataset.buttonNumber)

          // Highlight the active page number
          buttonNumber == currentPage
            ? button.classList.add('moj-pagination__item--active')
            : button.classList.remove('moj-pagination__item--active')

          // Show or hide page number buttons
          if (buttonNumber != 1 && buttonNumber != totalPages) {
            button.classList.add('hidden')
          }

          if (buttonNumber == currentPage || buttonNumber == currentPage + 1 || buttonNumber == currentPage - 1) {
            button.classList.remove('hidden')
          }

          if (currentPage == 1 && buttonNumber == 3) {
            button.classList.remove('hidden')
          }

          if (currentPage == totalPages && buttonNumber == totalPages - 2) {
            button.classList.remove('hidden')
          }

          if (buttonNumber > totalPages) {
            button.classList.add('hidden')
          }
        }

        // If there are 0 or 1 pages, hide all pagination buttons
        for (let button of allPaginationButtons) {
          if (totalPages <= 1) {
            button.classList.add('hidden')
          }
        }

        // Update the pagination results
        const firstRecord = totalPages == 0 ? 0 : (currentPage - 1) * pageSize + 1
        const lastRecord = currentPage * pageSize
        paginationResults[0].innerHTML = firstRecord
        paginationResults[1].innerHTML = Math.min(lastRecord, totalRows)
        paginationResults[2].innerHTML = totalRows
      }

      // Function to initialise the pagination buttons
      const initialisePaginationButtons = () => {
        prevButton.addEventListener('click', function (event) {
          event.preventDefault()
          if (currentPage != 1) {
            currentPage--
            updateTable(currentPage)
            updatePagination(currentPage)
          }
          return false
        })

        nextButton.addEventListener('click', function (event) {
          event.preventDefault()
          if (currentPage != totalPages) {
            currentPage++
            updateTable(currentPage)
            updatePagination(currentPage)
          }
          return false
        })

        for (let button of pageButtons) {
          button.addEventListener('click', function (event) {
            event.preventDefault()
            const newPage = parseInt(button.dataset.buttonNumber)
            currentPage = newPage
            updateTable()
            updatePagination()
            return false
          })
        }
      }

      // Add an additional event listener to the moj sortable table's sort buttons. After Rows are sorted, the table will update to show the correct Rows.
      const initialiseSortableTableButtons = () => {
        const sortableTableButtons = Array.from(
          table.querySelector('.govuk-table__head').getElementsByTagName('button'),
        )

        sortableTableButtons.forEach(button =>
          button.addEventListener('click', function () {
            setTimeout(function () {
              updateTable()
            }, 0)
          }),
        )
      }

      // Initialise the component
      updateTable()
      updatePagination()
      initialiseSortableTableButtons()
      initialisePaginationButtons()
    }
  }
}

export { init }
