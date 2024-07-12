import $ from 'jquery'
import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import * as emsUI from './emsUI.js'

// JQuery required for mojFrontend.
// https://design-patterns.service.justice.gov.uk/get-started/setting-up-javascript/
window.$ = $

govukFrontend.initAll()
mojFrontend.initAll()
emsUI.initAll()
