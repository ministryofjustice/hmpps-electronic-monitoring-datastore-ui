function init() {
  const emsSortableTables = document.getElementsByClassName('ems-sortable-table')

  for (let table of emsSortableTables) {
    const pageSize = parseInt(table.dataset.pageSize) || 10
    let currentPage = parseInt(table.dataset.currentPage) || 1
    let rows
    let totalRows
    let totalPages

    const setRowsAndPages = () => {
      const unfilteredRows = Array.from(
        table.querySelector('.govuk-table__body').getElementsByClassName('govuk-table__row'),
      )
      rows = unfilteredRows.filter(row => !row.classList.contains('filter-active'))
      totalRows = rows.length
      totalPages = Math.ceil(totalRows / pageSize)
      currentPage = currentPage <= totalPages ? currentPage : 1
    }
    setRowsAndPages()

    const displayNoRecords = () => {
      table.querySelector('.govuk-table').classList.add('hidden')
      table.querySelector('.ems-sortable-table__no-results').classList.remove('hidden')
    }
    const displayRecords = () => {
      table.querySelector('.govuk-table').classList.remove('hidden')
      table.querySelector('.ems-sortable-table__no-results').classList.add('hidden')
    }

    if (totalRows == 0) {
      displayNoRecords()
    } else {
      displayRecords()

      const pagination = table.querySelector('.moj-pagination')
      const allPaginationButtons = pagination.querySelectorAll('.moj-pagination__item')
      const prevButton = pagination.querySelector('.moj-pagination__item--prev')
      const nextButton = pagination.querySelector('.moj-pagination__item--next')
      const pageButtons = pagination.getElementsByClassName('moj-pagination__item--link')
      const dots = pagination.getElementsByClassName('moj-pagination__item--dots')
      const paginationResults = pagination.querySelector('.moj-pagination__results').getElementsByTagName('b')

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

        if (totalRows == 0) {
          displayNoRecords()
        } else {
          displayRecords()
        }
      }

      const updatePagination = () => {
        setRowsAndPages()

        currentPage == 1 ? prevButton.classList.add('hidden') : prevButton.classList.remove('hidden')
        currentPage == totalPages ? nextButton.classList.add('hidden') : nextButton.classList.remove('hidden')

        if (totalPages > 5) {
          currentPage < 4 ? dots[0].classList.add('hidden') : dots[0].classList.remove('hidden')

          currentPage > totalPages - 3 && dots[1] ? dots[1].classList.add('hidden') : dots[1].classList.remove('hidden')
        } else {
          for (let dotsElement of dots) {
            dotsElement.classList.add('hidden')
          }
        }

        for (let button of pageButtons) {
          const buttonNumber = parseInt(button.dataset.buttonNumber)

          buttonNumber == currentPage
            ? button.classList.add('moj-pagination__item--active')
            : button.classList.remove('moj-pagination__item--active')

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

        for (let button of allPaginationButtons) {
          if (totalPages <= 1) {
            button.classList.add('hidden')
          }
        }

        const firstRecord = totalPages == 0 ? 0 : (currentPage - 1) * pageSize + 1
        const lastRecord = currentPage * pageSize
        paginationResults[0].innerHTML = firstRecord
        paginationResults[1].innerHTML = Math.min(lastRecord, totalRows)
        paginationResults[2].innerHTML = totalRows
      }

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

      updateTable()
      updatePagination()
      initialiseSortableTableButtons()
      initialisePaginationButtons()
    }
  }
}

export { init }
