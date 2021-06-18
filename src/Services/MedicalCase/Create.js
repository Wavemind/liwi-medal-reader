/**
 * The external imports
 */
import uuid from 'react-native-uuid'
/**
 * The internal imports
 */
import { generateNodes } from '@/Services/Node'
import { getStages } from '@/Utils/Navigation/GetStages'

export default async ({ algorithm }) => {
  const stages = getStages()
  const stage = stages[0]
  const step = stage.steps[0]
  return {
    // activities: [{ stage: 'Registration', questions: [{ node: 'nodeId', previousValue: '', newValue: 'Yes'}]}],
    activities: [{ stage: stage.label, step: step.label, questions: [] }],
    comment: '',
    consent: !!algorithm.config.consent_management,
    createdAt: new Date().getTime(),
    diagnosis: {
      proposed: [],
      excluded: [],
      diagnoses: [],
      additional: {},
      agreed: {},
      refused: [],
      custom: {},
    },
    id: uuid.v4(),
    nodes: generateNodes({ nodes: algorithm.nodes }),
    json: '',
    advancement: {
      stage: 0,
      step: 0,
    },
    synchronizedAt: null,
    updatedAt: new Date().getTime(),
    versionId: algorithm.version_id,
  }
}
