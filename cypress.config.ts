import { defineConfig } from 'cypress'
import { resetStubs } from './integration_tests_cypress/mockApis/wiremock'
import hmppsAuth from './integration_tests_cypress/mockApis/hmppsAuth'
import tokenVerification from './integration_tests_cypress/mockApis/tokenVerification'
import * as datastore from './integration_tests_cypress/mockApis/datastore'

export default defineConfig({
  allowCypressEnv: false,
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests_cypress/fixtures',
  screenshotsFolder: 'integration_tests_cypress/screenshots',
  videosFolder: 'integration_tests_cypress/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'integration_tests_cypress/reporter-config.json',
  },
  taskTimeout: 60000,
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        reset: resetStubs,
        ...hmppsAuth,
        ...tokenVerification,
        ...datastore,
        /*
         * used to output summary accessibility testing issues found to console during integration testing
         */
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message)

          return null
        },
        /*
         * used to output table accessibility testing details found to console during integration testing
         */
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message)

          return null
        },
      })
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests_cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests_cypress/support/index.ts',
  },
})
