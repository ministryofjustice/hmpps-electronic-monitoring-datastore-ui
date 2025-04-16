export interface IndegrityOrderDetails {
  legacySubjectId: string
  firstName: string | null
  lastName: string | null
  alias: string | null
  dateOfBirth: string | null
  adultOrChild: string | null
  sex: string | null
  contact: string | null
  primaryAddressLine1: string | null
  primaryAddressLine2: string | null
  primaryAddressLine3: string | null
  primaryAddressPostCode: string | null
  phoneOrMobileNumber: string | null
  ppo: string | null
  mappa: string | null
  technicalBail: string | null
  manualRisk: string | null
  offenceRisk: boolean
  postCodeRisk: string | null
  falseLimbRisk: string | null
  migratedRisk: string | null
  rangeRisk: string | null
  reportRisk: string | null
  orderStartDate: string | null
  orderEndDate: string | null
  orderType: string | null
  orderTypeDescription: string | null
  orderTypeDetail: string | null
  wearingWristPid: string | null
  notifyingOrganisationDetailsName: string | null
  responsibleOrganisation: string | null
  responsibleOrganisationDetailsRegion: string | null
}
