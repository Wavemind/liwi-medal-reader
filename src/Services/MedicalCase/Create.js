/**
 * The external imports
 */
import uuid from 'react-native-uuid'
import { getVersion, getBuildNumber } from 'react-native-device-info'

/**
 * The internal imports
 */
import { GenerateNodesService } from '@/Services/Node'

export default async ({ algorithm, patientId }) => {
  const appVersion = getVersion()
  const appBuildNumber = getBuildNumber()

  return {
    activities: [],
    comment: '',
    consent: true,
    createdAt: new Date().getTime(),
    forceClosed: false,
    closedAt: 0,
    diagnosis: {
      proposed: [],
      excluded: [],
      additional: {},
      agreed: {},
      refused: [],
      custom: {},
    },
    id: uuid.v4(),
    patient_id: patientId,
    nodes: GenerateNodesService({ nodes: algorithm.nodes }),
    json: '',
    advancement: {
      stage: 0,
      step: 0,
    },
    synchronizedAt: 0,
    json_version: algorithm.json_version,
    updatedAt: new Date().getTime(),
    version_id: algorithm.version_id,
    fail_safe: false,
    savedInDatabase: false,
    appVersion: `${appVersion}.${appBuildNumber}`,
  }
}
