import { validateDate } from '../utils/validateDate.js'

function init() {
  const emsSearchForms = document.querySelectorAll('.ems-search-form')

  for (let searchForm of emsSearchForms) {
    const dateForm = searchForm.querySelector('.ems-form-group__date')
    const dateErrorMessage = dateForm.querySelector('#date-of-birth-error')
    const dateFields = dateForm.querySelectorAll('.govuk-input')

    const dateOfBirthIsValid = () => {
      const dateInputs = {
        day: dateFields[0].value,
        month: dateFields[1].value,
        year: dateFields[2].value,
        dateName: 'Date of birth',
        isPast: true,
        isMandatory: false,
      }

      const { error: errorMessage, errorFields } = validateDate(dateInputs)

      if (errorMessage) {
        dateForm.classList.add('govuk-form-group--error')
        dateErrorMessage.classList.remove('govuk-visually-hidden')
        dateErrorMessage.textContent = errorMessage

        for (let field of dateFields) {
          field.classList.remove('govuk-input--error')
        }
        errorFields.forEach(field => {
          dateForm.querySelector(`#date-of-birth-${field}`).classList.add('govuk-input--error')
        })

        return false
      } else {
        dateForm.classList.remove('govuk-form-group--error')
        dateErrorMessage.classList.add('govuk-visually-hidden')
        dateErrorMessage.textContent = ''

        for (let field of dateFields) {
          field.classList.remove('govuk-input--error')
        }

        return true
      }
    }

    const submitButton = searchForm.querySelector('.ems-search-form__button--submit')

    submitButton.classList.add('test-class')

    submitButton.addEventListener('click', event => {
      event.preventDefault()
      const validation = dateOfBirthIsValid()

      if (validation) {
        searchForm.submit()
      }
    })
  }
}

export { init }
