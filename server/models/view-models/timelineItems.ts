export type TimelineCardProperty = {
  label: string
  value: string
}

export type TimelineCard = {
  title: string
  properties: TimelineCardProperty[]
}

export type TimelineItem = {
  label: string
  dateTime: string
  cards: TimelineCard[]
}
