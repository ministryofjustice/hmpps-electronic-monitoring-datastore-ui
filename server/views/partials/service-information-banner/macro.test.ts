import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'

import { setUpNunJucksFilters } from '../../../utils/nunjucksSetup'

describe('Service information banner', () => {
  let njkEnv: nunjucks.Environment

  const renderMacro = () => {
    const template = `
      {% from "partials/service-information-banner/macro.njk" import serviceInformationBanner %}
      {{ serviceInformationBanner() }}
    `
    return njkEnv.renderString(template, {})
  }

  beforeAll(() => {
    njkEnv = nunjucks.configure(
      ['server/views', 'node_modules/govuk-frontend/dist', 'node_modules/@ministryofjustice/frontend/'],
      {
        autoescape: true,
        trimBlocks: true,
        lstripBlocks: true,
      },
    )

    setUpNunJucksFilters(njkEnv)
  })

  test('Should show warning banner when it is enabled', () => {
    const html = renderMacro()
    const $ = cheerio.load(html)

    expect($('.service-information-banner').length).toBe(1)
    expect($('.govuk-warning-text__icon').length).toBe(1)
    expect($('.govuk-warning-text__text').text()).toContain(
      'This service gives you access to all order data that was held by Capita and G4S',
    )
  })
})
