import z from 'zod'

export const EquipmentDetailModel = z.object({
  id: z.string(),
  equipmentCategoryDescription: z.string(),
  installedDateTime: z.string(),
  removedDateTime: z.string().nullable(),
})

export const EquipmentDetailsModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
  pid: EquipmentDetailModel.optional(),
  hmu: EquipmentDetailModel.optional(),
})

export type EquipmentDetail = z.infer<typeof EquipmentDetailModel>
export type EquipmentDetails = z.infer<typeof EquipmentDetailsModel>
