import z from 'zod'

export type IntegrityEquipmentDetail = z.infer<typeof IntegrityEquipmentDetail>
export const IntegrityEquipmentDetail = z.object({
  id: z.string(),
  equipmentCategoryDescription: z.string().nullish(),
  installedDateTime: z.string().nullish(),
  removedDateTime: z.union([z.string(), z.undefined()]).optional(),
})

export type IntegrityEquipmentDetails = z.infer<typeof IntegrityEquipmentDetails>
export const IntegrityEquipmentDetails = z.object({
  legacySubjectId: z.string(),
  pid: IntegrityEquipmentDetail.optional(),
  hmu: IntegrityEquipmentDetail.optional(),
})
