declare module '@ministryofjustice/frontend/moj/filters/all' {
  export function date(timestamp: string, format: string): string
  export function mojDate(timestamp: string, type: string): string

  export function allMojFilters(): {
    date
    mojDate
  }

  export default allMojFilters
}
