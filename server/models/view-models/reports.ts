import z from 'zod'

export const IntegrityReportsModel = z.object({
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
export type IntegrityReports = z.infer<typeof IntegrityReportsModel>
