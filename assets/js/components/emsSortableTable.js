function init() {
  const emsSortableTables = document.getElementsByClassName('ems-sortable-table')

  for (let table of emsSortableTables) {
    const totalRecords = parseInt(table.dataset.totalrecords)
    const totalPages = parseInt(table.dataset.totalpages)
    const pageSize = parseInt(table.dataset.pagesize)
    let currentPage = parseInt(table.dataset.currentpage)

    // Get pagination elements
    const pagination = table.querySelector('.govuk-pagination')
    const prevButton = pagination.querySelector('.govuk-pagination__prev')
    const nextButton = pagination.querySelector('.govuk-pagination__next')
    const pageButtons = pagination.getElementsByClassName('govuk-pagination__item--link')
    const ellipses = pagination.getElementsByClassName('govuk-pagination__item--ellipses')

    // Show the correct page of records
    const updateTable = page => {
      // Get table rows in the order that they appear in the DOM
      const tableRows = Array.from(table.getElementsByClassName('govuk-table__data-row'))

      // Hide all rows
      tableRows.forEach(row => row.classList.add('hidden'))

      // Display the current page's records
      const firstIndex = (currentPage - 1) * pageSize
      const lastIndex = currentPage * pageSize
      const visibleRows = tableRows.slice(firstIndex, lastIndex)
      visibleRows.forEach(row => row.classList.remove('hidden'))
    }

    // Show the correct pagination buttons based on the current page. Used to update the pagination component when the page is changed.
    const updatePagination = page => {
      // Show or hide previous & next buttons
      page == 1 ? prevButton.classList.add('hidden') : prevButton.classList.remove('hidden')

      page == totalPages ? nextButton.classList.add('hidden') : nextButton.classList.remove('hidden')

      // Show or hide ellipses
      if (totalPages > 5) {
        page < 4 ? ellipses[0].classList.add('hidden') : ellipses[0].classList.remove('hidden')

        page > totalPages - 3 ? ellipses[1].classList.add('hidden') : ellipses[1].classList.remove('hidden')
      }

      // Show or hide page number buttons
      for (let button of pageButtons) {
        const buttonNumber = parseInt(button.dataset.buttonnumber)

        // Highlight the active page number
        buttonNumber == page
          ? button.classList.add('govuk-pagination__item--current')
          : button.classList.remove('govuk-pagination__item--current')

        // Hide all page buttons except the first and last ones, which are always visible
        if (buttonNumber != 1 && buttonNumber != totalPages) {
          button.classList.add('hidden')
        }

        // Show the buttons for the current page ±1
        if (buttonNumber == page || buttonNumber == page + 1 || buttonNumber == page - 1) {
          button.classList.remove('hidden')
        }

        // If the first or last page is selected, show the first or last three page buttons.
        if (page == 1 && buttonNumber == 3) {
          button.classList.remove('hidden')
        }
        if (page == totalPages && buttonNumber == totalPages - 2) {
          button.classList.remove('hidden')
        }
      }
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
          const newPage = parseInt(button.dataset.buttonnumber)
          currentPage = newPage
          updateTable(currentPage)
          updatePagination(currentPage)
          return false
        })
      }
    }

    // Initialise the component
    updateTable(currentPage)
    updatePagination(currentPage)
    initialisePaginationButtons()
  }
}

export { init }
