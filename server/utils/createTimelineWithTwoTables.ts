import { VisitDetails } from '../interfaces/events'

const createTimeline = (events: VisitDetails, heading: string) => {
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
        text: `Visit address: ${event.address}`,
      },
      html: `
            <details class="govuk-details govuk-!-margin-bottom-0">
              <summary class="govuk-details__summary">
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
              <table class="govuk-table"> 
                <thead class="govuk-table__head">
                  <tr class="govuk-table__row">
                    <th scope="col" class="govuk-table__header">Visit Type</th>
                    <th scope="col" class="govuk-table__header">Visit Outcome</th>
                  </tr>
                </thead>
                <tbody class="govuk-table__body">
                  <tr class="govuk-table__row">
                    <td scope="row" class="govuk-table__cell govuk-!-width-one-third">
                        RAM1
                    </td>
                    <td class="govuk-table__cell">
                    Success - Negative RAM - Subject present
                  <tr class="govuk-table__row">
                    <td scope="row" class="govuk-table__cell">
                        Strap Tamper
                    </td>
                    <td class="govuk-table__cell">
                        Success
                    </td>
                  </tr>
                </tbody>
              </table>
            </details>
        `,
      datetime: {
        timestamp: `${event.date}`,
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
