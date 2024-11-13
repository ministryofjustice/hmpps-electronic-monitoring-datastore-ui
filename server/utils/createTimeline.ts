import { Events } from '../interfaces/events'

const createTimeline = (events: Events, heading: string) => {
  const timeline = events.events.map(event => {
    const recordsAsHtml: string = event.records
      .map(
        record => `
        <tr class="govuk-table__row">
          <td scope="row" class="govuk-table__cell govuk-!-width-one-third">
            ${record.key}
          </td>
          <td class="govuk-table__cell">
            ${record.value}
          </td>
        </tr>
      `,
      )
      .join('')

    return {
      label: {
        text: event.name,
      },
      html: `
            <details class="govuk-details govuk-!-margin-bottom-0">
              <summary class="govuk-details__summary">
                <!-- <span class="govuk-details__summary-text">
                ${event.date}
                </span>
                -->
              </summary>
              <table class="govuk-table">
                <thead class="govuk-table__head">
                  <tr class="govuk-table__row">
                    <th scope="col" class="govuk-table__header">Type</th>
                    <th scope="col" class="govuk-table__header">Details</th>
                  </tr>
                </thead>
                <tbody class="govuk-table__body">
                  ${recordsAsHtml}
                </tbody>
              </table>
            </details>
        `,
      datetime: {
        timestamp: '2019-01-01T14:01:00.000Z',
        type: 'datetime',
      },
    }
  })

  return {
    heading,
    backUrl: events.backUrl,
    timeline,
  }
}

export default createTimeline
