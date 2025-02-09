import z from 'zod'

export const EquipmentDetail = z.object({
  id: z.string(),
  equipmentCategoryDescription: z.string(),
  installedDateTime: z.date(),
  removedDateTime: z.date(),
})

export const EquipmentDetailsModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
  pid: z.object({}).optional(),
  hmu: z.object({}).optional(),
})

export type EquipmentDetails = z.infer<typeof EquipmentDetailsModel>
