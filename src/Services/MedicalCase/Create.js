/**
 * The external imports
 */
import uuid from 'react-native-uuid'
/**
 * The internal imports
 */
import { generateNodes } from '@/Services/Node'

export default async ({ algorithm }) => {
  return {
    activities: [],
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
    synchronized_at: null,
    updatedAt: new Date().getTime(),
    version_id: algorithm.id,
  }
}
