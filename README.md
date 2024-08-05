# hmpps-ems-datastore-ui

[![repo standards badge](https://img.shields.io/badge/endpoint.svg?&style=flat&logo=github&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-ems-datastore-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-ems-datastore-ui 'Link to report')
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-ems-datastore-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-ems-datastore-ui)

This frontend service allows CMT to access historical electronic monitoring data.

## About the project

- This repo was build from the boilerplate repo [hmpps-template-typescript](https://github.com/ministryofjustice/hmpps-template-typescript). The template is community managed by the mojdt `#typescript` slack channel.
- Most of the frontend components are from the [GOV.UK design system](https://design-system.service.gov.uk/) or the [MoJ design system](https://design-patterns.service.justice.gov.uk/). A small number of modified and custom components are also used.
- Currently the service is not connected to any live data; only mock data is used, which is hardcoded in this repo and is accessed using helper functions in the `data` directory. This data is entirely fictitious. It isn't related to any real case data.
- Currently the application is not deployed or deployable. HMPPS Auth has been temporarily disabled to permit development. These featues should be reinstated before this version of the application is deployed.
- The original bootstrap readme stated that this project is dependant on redis for session store and token caching. This should also be set up.

## Running the application locally

### First time setup

Ensure you are using `node v20.x` and `npm v10.x` You can check this by running `node -v` & `npm -v`.

Then install dependencies using `npm install`.

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json` and the CircleCI build config.

### Run the application

To build the assets & start the application with nodemon, run `npm run start:dev`'

Navigate to `localhost:3000/search` to start.

### Run linter

`npm run lint`

### Run tests using Jest

`npm run test`

### Run integration tests using Cypress

For local running, start a test db and wiremock instance by:

`docker compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`

Or run tests with the cypress UI:

`npm run int-test-ui`

## Change log

A changelog for the service is available [here](./CHANGELOG.md)

## Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`

## Custom Components

A small number of bespoke components were created for this project. They are listed below. Each of these components' names are prefixed with EMS (Electronic Monitoring Service) to help developers distinguish between them and pre-existing GOV.UK / MoJ components.

### EMS Service Information

This is a simple info banner that is shown on every page. It provides information abut the data that can be accesed using this service.

### EMS Sortable Table

The MoJ design system includes a sortable table. Columns can be sorted by clicking on a column heading. However this component was not designed to work with pagination. When records are sorted, only the current page's records are reordered.

The EMS sortable table combines sortable columns and pagination. When records are sorted, all of the pages of records are reorganised.

The EMS sortable table takes an object of records as an argument, and converts these into a paginated sortable table.

### EMS Date Filter

CMT needs to be able to filter some [tables](https://design-system.service.gov.uk/components/table/) and [timelines](https://design-patterns.service.justice.gov.uk/components/timeline/) by date.

The EMS date filter is designed for this.

It is currently designed to work with the EMS Sortable Table. It can be extended to work with a customised version of the MoJ Timeline component.

It includes some client-side date input validation.

### EMS Search Form

Currently this javascript component just adds client-side date input validation to the search page. It could be extended to include additional client-side input validation.

### EMS Button Grid

This is a simple responsive grid of buttons used in the order summary page. It was created by applying some custom styles to a `govuk-button-group` component.

## Mock API

As this repo isn't currently deployed or connected to a live data source, pages are populated using mock data. To facilitate API integration in the future, this data is obtained using mock APIs.

- `/server/data/mockData` contains simple typescript scripts that return objects of mock case data.
- `/server/data/` contains mock API endpoints that retrieve and return this data.
- `server/routes/index.ts` access these endpoints when routes are accessed, then route the user to the appropriate page populated with the mock data.
- In some cases the mock data is processed before being passed into the page template. For example, an array of data objects may be converted into an array of HTML elements that can be used in a page template. The scripts for such transformations are in `/server/utils`. They are imported & used in `server/routes/index.ts`.
