import z from 'zod'

export const IntegrityEquipmentDetailModel = z.object({
  id: z.string(),
  equipmentCategoryDescription: z.string(),
  installedDateTime: z.string(),
  removedDateTime: z.string().nullable(),
})

export const IntegrityEquipmentDetailsModel = z.object({
  legacySubjectId: z.number(),
  pid: IntegrityEquipmentDetailModel.optional(),
  hmu: IntegrityEquipmentDetailModel.optional(),
})

export type IntegrityEquipmentDetail = z.infer<typeof IntegrityEquipmentDetailModel>
export type IntegrityEquipmentDetails = z.infer<typeof IntegrityEquipmentDetailsModel>
