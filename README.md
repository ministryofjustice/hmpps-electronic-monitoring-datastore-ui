# hmpps-electronic-monitoring-datastore-ui

[![repo standards badge](https://img.shields.io/endpoint?labelColor=231f20&color=005ea5&style=flat&label=MoJ%20Compliant&url=https%3A%2F%2Foperations-engineering-reports-prod.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fendpoint%2Fhmpps-electronic-monitoring-datastore-ui&logo=data:image/png;base64,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)](https://operations-engineering-reports-prod.cloud-platform.service.justice.gov.uk/public-report/hmpps-electronic-monitoring-datastore-ui)
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-electronic-monitoring-datastore-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-electronic-monitoring-datastore-ui)

UI application to access historical data from the Electronic Monitoring Datastore.  
This is a front end for the [Electronic Monitoring Datastore API](https://github.com/ministryofjustice/hmpps-electronic-monitoring-datastore-api).

## Contents
- [hmpps-electronic-monitoring-datastore-ui](#hmpps-electronic-monitoring-datastore-ui)
  - [Contents](#contents)
  - [Oauth2 Credentials](#oauth2-credentials)
    - [Auth Code flow](#auth-code-flow)
    - [Client Credentials flow](#client-credentials-flow)
  - [Dependencies](#dependencies)
    - [HMPPS Auth](#hmpps-auth)
    - [REDIS](#redis)
  - [Running the app](#running-the-app)
    - [Running the app via docker-compose](#running-the-app-via-docker-compose)
    - [Running the app in VS Code for development](#running-the-app-in-vs-code-for-development)
    - [Logging in with a test user](#logging-in-with-a-test-user)
  - [Linting and testing](#linting-and-testing)
    - [Run linter](#run-linter)
    - [Run unit tests](#run-unit-tests)
    - [Run integration tests using Cypress](#run-integration-tests-using-cypress)
  - [Custom Component details](#custom-component-details)
    - [EMS Service Information](#ems-service-information)
    - [EMS Sortable Table](#ems-sortable-table)
    - [EMS Date Filter](#ems-date-filter)
    - [EMS Search Form](#ems-search-form)
    - [EMS Button Grid](#ems-button-grid)
  - [Mock API](#mock-api)
  - [Test Utils](#test-utils)


## Oauth2 Credentials

The app is set up to run with two sets of credentials, each one support a different oauth2 flows.

### Auth Code flow

These are used to allow authenticated users to access the application. After the user is redirected from auth back to the application, the typescript app will use the returned auth code to request a JWT token for that user containing the user's roles. The JWT token will be verified and then stored in the user's session.

These credentials are configured using the following env variables:

- AUTH_CODE_CLIENT_ID
- AUTH_CODE_CLIENT_SECRET

### Client Credentials flow

These are used by the application to request tokens to make calls to APIs. These are system accounts that will have their own sets of roles.

Most API calls that occur as part of the request/response cycle will be on behalf of a user.
To make a call on behalf of a user, a username should be passed when requesting a system token. The username will then become part of the JWT and can be used downstream for auditing purposes.

These tokens are cached until expiration.

These credentials are configured using the following env variables:

- CLIENT_CREDS_CLIENT_ID
- CLIENT_CREDS_CLIENT_SECRET

## Dependencies

### HMPPS Auth

To allow authenticated users to access your application you need to point it to a running instance of `hmpps-auth`. By default the application is configured to run against an instance running in docker that can be started via `docker-compose`.

**NB:** It's common for developers to run against the instance of auth running in the development/T3 environment for
local development.
Most APIs don't have images with cached data that you can run with docker: setting up realistic stubbed data in sync
across a variety of services is very difficult.

### REDIS

When deployed to an environment with multiple pods we run applications with an instance of REDIS/Elasticache to provide
a distributed cache of sessions.
The template app is, by default, configured not to use REDIS when running locally.

## Running the app
### Running the app via docker-compose

The easiest way to run the app is to use docker compose to create the service and all dependencies:  
> Run `docker compose pull` then `docker compose up`

If you want to run both the UI and the API locally:  
> Run `docker-compose -f docker-compose-with-api.yml up`.  
> This will run all services in the same network so they can talk to one another.  
> _You may need to change the reference in the docker-compose-with-api.yml file to point to your local API project source if it isn't in a sibling folder to your UI project._

### Running the app in VS Code for development
1. Install dependencies using `npm install`, ensuring you are using `node v20`

    > Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json` and the CircleCI build config.

2. Start the services required for the UI app using:  
`docker compose up --scale=hmpps-electronic-monitoring-ui=0`  

3. Build the assets and start the app with esbuild: `npm run start:dev`  
    > This uses an .env file replicating the environment variables in docker-compose.yml (which themselves replicate/simulate the values in the .helm folders). Rename `.env.example` -> `.env` to use these values.  
    > 
    > Environment variables set in here will be available when running `start:dev`

### Logging in with a test user

Once the application is running you should then be able to login with:

username: AUTH_USER
password: password123456

To request specific users and roles then raise a PR
to [update the seed data](https://github.com/ministryofjustice/hmpps-auth/blob/main/src/main/resources/db/dev/data/auth/V900_3__users.sql)
for the in-memory DB used by Auth

## Linting and testing

### Run linter

* `npm run lint` runs `eslint`.
* `npm run typecheck` runs the TypeScript compiler `tsc`.

### Run unit tests

`npm run test`

### Run integration tests using Cypress

1. For local running, start a wiremock instance: `docker compose -f docker-compose-test.yml up`  

2. Ensure you have built the app by running `npm run build`
   
3. Then, run the server in test mode: `npm run start-feature` (or `npm run start-feature:dev` to run with auto-restart on changes)

4. Either, run tests in headless mode with `npm run int-test` or run tests with the cypress UI with `npm run int-test-ui`.

## Custom Component details

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

As this repo isn't currently connected to a live data source, pages are populated using mock data. To facilitate API integration in the future, this data is obtained using mock APIs.

- `/server/data/mockData` contains simple typescript scripts that return objects of mock case data.
- `/server/data/` contains mock API endpoints that retrieve and return this data.
- `server/routes/index.ts` access these endpoints when routes are accessed, then route the user to the appropriate page populated with the mock data.
- In some cases the mock data is processed before being passed into the page template. For example, an array of data objects may be converted into an array of HTML elements that can be used in a page template. The scripts for such transformations are in `/server/utils`. They are imported & used in `server/routes/index.ts`.

## Test Utils

Test utilities for `hmppsAuthClient` and `datastoreClient` are found in `./server/data/testUtils/mock.ts`. As paths differ between running the application normally (in `dist`) and where `ts-jest` runs it, `ApplicationInfo` has to be mocked first. Otherwise, `Import from '..' (server/data/index.ts)` fails
