import z from 'zod'

export type AlchoholMonitoringReportsView = z.infer<typeof AlchoholMonitoringReportsView>
export const AlchoholMonitoringReportsView = z.object({
  orderDetails: z.boolean(),
  visitDetails: z.boolean(),
  // visitsAndTasks: z.boolean(),
  // eventHistory: z.boolean(),
  equipmentDetails: z.boolean(),
  // curfewHours: z.boolean(),
  // curfewViolations: z.boolean(),
  // contactHistory: z.boolean(),
  // suspensions: z.boolean(),
  suspensionOfVisits: z.boolean(),
  allEventHistory: z.boolean(),
  services: z.boolean(),
})
