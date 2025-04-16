import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { AlcoholMonitoringEquipmentDetails } from '../../../../server/models/alcoholMonitoring/equipmentDetails'

const defaultEquipmentDetails: AlcoholMonitoringEquipmentDetails = {
  legacySubjectId: 'AAMR123',
  deviceType: 'tag',
  deviceSerialNumber: '740',
  deviceAddressType: 'secondary',
  legFitting: 'right',
  deviceInstalledDateTime: '2001-01-01T01:10:10',
  deviceRemovedDateTime: '2002-02-02T02:20:20',
  hmuInstallDateTime: '2001-01-01T01:10:10',
  hmuRemovedDateTime: '2002-02-02T02:20:20',
}

type GetEquipmentDetailsStubOptions = {
  httpStatus: number
  legacySubjectId: string
  body?: AlcoholMonitoringEquipmentDetails[]
}

export const stubAlcoholMonitoringGetEquipmentDetails = (options: GetEquipmentDetailsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/alcohol-monitoring/${options.legacySubjectId}/equipment-details`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? options.body || [
              {
                ...defaultEquipmentDetails,
                legacySubjectId: options.legacySubjectId,
              },
            ]
          : [],
    },
  })

export default stubAlcoholMonitoringGetEquipmentDetails
