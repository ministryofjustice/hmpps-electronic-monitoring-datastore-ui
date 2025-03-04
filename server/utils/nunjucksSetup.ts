/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import fs from 'fs'
import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'
import govUKFilters from '@x-govuk/govuk-prototype-filters'
import { initialiseName, makePageTitle } from './utils'
import config from '../config'
import logger from '../../logger'

export default function nunjucksSetup(app: express.Express): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = config.applicationName
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''
  let assetManifest: Record<string, string> = {}

  try {
    const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
    assetManifest = JSON.parse(fs.readFileSync(assetMetadataPath, 'utf8'))
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(e, 'Could not read asset manifest file')
    }
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)

  // globals
  njkEnv.addGlobal('makePageTitle', makePageTitle)

  // Add filters from MOJ Frontend
  const mojFilters = Object.assign(allMojFilters())
  Object.keys(mojFilters).forEach(filterName => {
    njkEnv.addFilter(filterName, mojFilters[filterName])
  })
  Object.keys(govUKFilters).forEach(filterName => {
    njkEnv.addFilter(filterName, govUKFilters[filterName])
  })
}
