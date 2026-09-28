import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'

import { cleanTextContent } from '../../../testutils/cleanTextContent'
import { setUpNunJucksFilters } from '../../../utils/nunjucksSetup'

describe('Integrity Event timeline', () => {
  let njkEnv: nunjucks.Environment

  const renderMacro = (events: unknown[]) => {
    const template = `
      {% from "partials/events-timeline/macro.njk" import eventTimeline %}
      {{ eventTimeline(${JSON.stringify(events, null, 2)}) }}
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

  describe('Event history timeline', () => {
    test('Can see one event in the history', () => {
      const html = renderMacro([
        {
          label: 'Test event',
          dateTime: '2024-05-01T12:00:00Z',
        },
      ])
      const $ = cheerio.load(html)

      expect($('.events-timeline').length).toBe(1)
      expect($('.events-timeline__item').length).toBe(1)
    })

    test('Can see many events in the history', () => {
      const html = renderMacro([
        {
          label: 'Test event',
          dateTime: '2024-05-01T12:00:00Z',
        },
        {
          label: 'Test event 2',
          dateTime: '2024-05-01T13:00:00Z',
        },
        {
          label: 'Test event 3',
          dateTime: '2024-05-01T14:00:00Z',
        },
      ])
      const $ = cheerio.load(html)

      expect(cleanTextContent($('.events-timeline .events-timeline__item').text())).toEqual(
        [
          'Test event',
          '1 May 2024 at 1pm',
          'Test event 2',
          '1 May 2024 at 2pm',
          'Test event 3',
          '1 May 2024 at 3pm',
        ].join('\n'),
      )
    })

    test('Can see no description if no cards are provided', () => {
      const html = renderMacro([
        {
          label: 'Test event',
          dateTime: '2024-06-01T12:00:00Z',
        },
      ])
      const $ = cheerio.load(html)

      expect(cleanTextContent($('.events-timeline .events-timeline__item').text())).toEqual(
        ['Test event', '1 Jun 2024 at 1pm'].join('\n'),
      )
    })

    test('Can see a description if any cards are provided', () => {
      const html = renderMacro([
        {
          label: 'Test event',
          dateTime: '2024-09-01T12:30:00Z',
          cards: [
            {
              title: 'Test card',
              properties: [{ label: 'Test property A', value: 'Test value 001' }],
            },
          ],
        },
      ])
      const $ = cheerio.load(html)

      expect(cleanTextContent($('.events-timeline .events-timeline__item').text())).toEqual(
        ['Test event', '1 Sep 2024 at 1:30pm', 'Test card', 'Test property A', 'Test value 001'].join('\n'),
      )
    })

    test('Can see multiple cards and properties for an event', () => {
      const html = renderMacro([
        {
          label: 'Test event',
          dateTime: '2024-05-01T12:00:00Z',
          cards: [
            {
              title: 'Alpha card',
              properties: [
                { label: 'Test property A', value: 'Test value 001' },
                { label: 'Test property B', value: 'Test value 002' },
                { label: 'Test property C', value: 'Test value 003' },
              ],
            },
            {
              title: 'Beta card',
              properties: [
                { label: 'Test property A', value: 'Test value 004' },
                { label: 'Test property B', value: 'Test value 005' },
                { label: 'Test property C', value: 'Test value 006' },
              ],
            },
          ],
        },
      ])
      const $ = cheerio.load(html)

      expect(cleanTextContent($('.events-timeline__item .govuk-summary-card__title').eq(0).text())).toEqual(
        'Alpha card',
      )
      expect(cleanTextContent($('.events-timeline__item .govuk-summary-card__content').eq(0).text())).toEqual(
        [
          'Test property A',
          'Test value 001',
          'Test property B',
          'Test value 002',
          'Test property C',
          'Test value 003',
        ].join('\n'),
      )
      expect(cleanTextContent($('.events-timeline__item .govuk-summary-card__title').eq(1).text())).toEqual('Beta card')
      expect(cleanTextContent($('.events-timeline__item .govuk-summary-card__content').eq(1).text())).toEqual(
        [
          'Test property A',
          'Test value 004',
          'Test property B',
          'Test value 005',
          'Test property C',
          'Test value 006',
        ].join('\n'),
      )
    })
  })
})
