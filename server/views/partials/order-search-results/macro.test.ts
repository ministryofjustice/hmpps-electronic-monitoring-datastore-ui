import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'

import { setUpNunJucksFilters } from '../../../utils/nunjucksSetup'

import { IntegritySearchResult } from '../../../models/view-models/integritySearchResults'

describe('Integrity Order search results', () => {
  let njkEnv: nunjucks.Environment

  const renderMacro = (orders: IntegritySearchResult[], pageSize = 20, currentPage = 1) => {
    const template = `
      {% from "partials/order-search-results/macro.njk" import orderSearchResults %}
      {{ orderSearchResults(${JSON.stringify(orders)}, ${pageSize}, ${currentPage}) }}
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

  describe('When no results are provided', () => {
    test('Can see no order search results', () => {
      const html = renderMacro([])
      const $ = cheerio.load(html)

      expect($('.order-search-results').length).toBe(1)
      expect($('.order-search-results__no-results').length).toBe(1)
      expect($('.order-search-results__no-results').text()).toContain('Sorry, no results were found for this search')
    })

    test('Can see no pagination', () => {
      const html = renderMacro([])
      const $ = cheerio.load(html)

      expect($('.govuk-pagination').length).toBe(0)
      expect($('.moj-pagination__results').length).toBe(0)
    })
  })

  describe('When one result is provided', () => {
    test('Can see one order search result', () => {
      const html = renderMacro([
        {
          legacySubjectId: '12345',
          name: 'John Martin',
          primaryAddress: ['123 Main St', 'Apt 4B', 'Sheffield', 'UK'],
          alias: 'Johnny',
          dateOfBirth: '1980-01-01',
          orderStartDate: '2023-01-01',
          orderEndDate: '2023-12-31',
          sortAddress: '123 Main St Apt 4B Sheffield UK',
          sortDateOfBirth: 19800101,
          sortOrderStartDate: 20230101,
          sortOrderEndDate: 20231231,
        },
      ])
      const $ = cheerio.load(html)

      expect($('.order-search-results__list').length).toBe(1)
      expect($('.order-search-results__list tbody tr').length).toBe(1)
      expect($('.order-search-results__list').text().replace(/\s+/g, ' ').trim()).toContain('12345 JOHN MARTIN')
    })

    test('Can see pagination', () => {
      const html = renderMacro([
        {
          legacySubjectId: '12345',
          name: 'John Martin',
        },
      ])
      const $ = cheerio.load(html)

      expect($('.govuk-pagination').length).toBe(1)
      expect($('.govuk-pagination').text().replace(/\s+/g, ' ').trim()).toContain('Previous page 1 ⋯ Next page')
      expect($('.moj-pagination__results').text().replace(/\s+/g, ' ').trim()).toContain('1 total orders')
    })
  })

  describe('When more then one result is provided', () => {
    test('Can see multiple order search results', () => {
      const html = renderMacro([
        {
          legacySubjectId: '12345',
          name: 'John Martin',
          primaryAddress: ['123 Main St', 'Apt 4B', 'Sheffield', 'UK'],
          alias: 'Johnny',
          dateOfBirth: '1980-01-01',
          orderStartDate: '2023-01-01',
          orderEndDate: '2023-12-31',
          sortAddress: '123 Main St Apt 4B Sheffield UK',
          sortDateOfBirth: 19800101,
          sortOrderStartDate: 20230101,
          sortOrderEndDate: 20231231,
        },
        {
          legacySubjectId: '67890',
          name: 'Jane Doe',
          primaryAddress: ['456 Elm St', 'Apt 5C', 'London', 'UK'],
          alias: 'Janie',
          dateOfBirth: '1990-02-02',
          orderStartDate: '2024-01-01',
          orderEndDate: '2024-12-31',
          sortAddress: '456 Elm St Apt 5C London UK',
          sortDateOfBirth: 19900202,
          sortOrderStartDate: 20240101,
          sortOrderEndDate: 20241231,
        },
        {
          legacySubjectId: '11223',
          name: 'Alice Smith',
          primaryAddress: ['789 Oak St', 'Apt 6D', 'Manchester', 'UK'],
          alias: 'Ally',
          dateOfBirth: '1985-03-03',
          orderStartDate: '2025-01-01',
          orderEndDate: '2025-12-31',
          sortAddress: '789 Oak St Apt 6D Manchester UK',
          sortDateOfBirth: 19850303,
          sortOrderStartDate: 20250101,
          sortOrderEndDate: 20251231,
        },
      ])
      const $ = cheerio.load(html)

      expect($('.order-search-results__list').length).toBe(1)
      expect($('.order-search-results__list tbody tr').length).toBe(3)
      expect($('.order-search-results__list').text().replace(/\s+/g, ' ').trim()).toContain('12345 JOHN MARTIN')
      expect($('.order-search-results__list').text().replace(/\s+/g, ' ').trim()).toContain('67890 JANE DOE')
      expect($('.order-search-results__list').text().replace(/\s+/g, ' ').trim()).toContain('11223 ALICE SMITH')
    })

    test('Can see pagination', () => {
      const html = renderMacro([
        {
          legacySubjectId: '123451',
          name: 'John Martin',
        },
        {
          legacySubjectId: '123452',
          name: 'John Martin Snr',
        },
        {
          legacySubjectId: '123453',
          name: 'John Martin Jnr',
        },
      ])
      const $ = cheerio.load(html)

      expect($('.govuk-pagination').length).toBe(1)
      expect($('.govuk-pagination').text().replace(/\s+/g, ' ').trim()).toContain('Previous page 1 ⋯ Next page')
      expect($('.moj-pagination__results').text().replace(/\s+/g, ' ').trim()).toContain('3 total orders')
    })
  })
})
