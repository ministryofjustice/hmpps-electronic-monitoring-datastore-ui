import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'

govukFrontend.initAll()
mojFrontend.initAll()

const $filter = document.querySelector('[data-module="moj-filter"]')

// eslint-disable-next-line no-new
new mojFrontend.FilterToggleButton($filter as HTMLElement, {
  bigModeMediaQuery: '(min-width: 48.0625em)',
  startHidden: true,
  toggleButton: {
    showText: 'Show filter',
    hideText: 'Hide filter',
    classes: 'govuk-button--secondary',
  },
  closeButton: {
    text: 'Close',
  },
})
